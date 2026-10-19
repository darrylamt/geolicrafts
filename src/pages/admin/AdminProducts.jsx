import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, Upload, Search, Download, ImageIcon, X, ExternalLink, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/ui/AdminHeader'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import { invalidateProducts, sortProducts } from '../../lib/products'
import { useCategories } from '../../lib/content'
import { uploadImage } from '../../lib/upload'
import { productPath } from '../../lib/site'

// Detail fields need supabase/migrations/002_product_details_and_enquiries.sql
const DETAIL_FIELDS = [
  { key: 'dimensions', label: 'Dimensions', placeholder: 'H 60 cm · Ø 30 cm' },
  { key: 'materials', label: 'Materials', placeholder: 'Tweneboa wood, goat skin' },
  { key: 'colors', label: 'Colours', placeholder: 'Natural, black, red' },
  { key: 'min_order', label: 'Minimum order', placeholder: '10 pieces' },
  { key: 'lead_time', label: 'Lead time', placeholder: '3–4 weeks' },
]
const EMPTY_FORM = {
  name: '', category: '', description: '', image_url: '', images: [], featured: false, sort_order: '',
  ...Object.fromEntries(DETAIL_FIELDS.map(f => [f.key, ''])),
}
const PAGE_SIZES = [10, 25, 50, 100]
const FEATURED_FILTER = '__featured'

// Supabase filters go in the URL, so act on large selections in batches
async function inBatches(ids, run) {
  for (let i = 0; i < ids.length; i += 100) {
    const { error } = await run(ids.slice(i, i + 100))
    if (error) return { error }
  }
  return { error: null }
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deleting, setDeleting] = useState(null)
  const [selected, setSelected] = useState(() => new Set())
  const [bulkCategory, setBulkCategory] = useState('')
  const [bulkBusy, setBulkBusy] = useState(false)
  const fileRef = useRef()
  const galleryRef = useRef()
  const categories = useCategories(products)

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(sortProducts(data || []))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true) }
  const openEdit = p => {
    setForm({
      name: p.name, category: p.category, description: p.description || '', image_url: p.image_url || '',
      images: Array.isArray(p.images) ? p.images : [],
      featured: !!p.featured, sort_order: p.sort_order ?? '',
      ...Object.fromEntries(DETAIL_FIELDS.map(f => [f.key, p[f.key] || ''])),
    })
    setEditId(p.id)
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setEditId(null) }

  const uploadFile = file => uploadImage(file, 'products')

  const handleUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadFile(file)
    if (url) { setForm(f => ({ ...f, image_url: url })); toast.success('Image uploaded') }
    else toast.error('Upload failed')
    setUploading(false)
    e.target.value = ''
  }

  const handleGalleryUpload = async e => {
    const files = [...(e.target.files || [])]
    if (!files.length) return
    setUploading(true)
    const urls = (await Promise.all(files.map(uploadFile))).filter(Boolean)
    if (urls.length) setForm(f => ({ ...f, images: [...f.images, ...urls] }))
    if (urls.length < files.length) toast.error('Some uploads failed')
    setUploading(false)
    e.target.value = ''
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name, category: form.category, description: form.description, image_url: form.image_url,
      featured: form.featured,
      sort_order: form.sort_order === '' ? null : Number(form.sort_order),
    }
    // Only send detail fields when used, so saving still works before migration 002 is applied
    const details = { images: form.images, ...Object.fromEntries(DETAIL_FIELDS.map(f => [f.key, form[f.key].trim() || null])) }
    const usesDetails = form.images.length > 0 || DETAIL_FIELDS.some(f => form[f.key].trim()) || products.some(p => 'images' in p)
    if (usesDetails) Object.assign(payload, details)
    let error
    if (editId) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('products').insert([payload]))
    }
    if (error) {
      const missingColumn = error.code === 'PGRST204' || error.code === '42703'
      toast.error(missingColumn ? 'Run migration 002 in Supabase to enable product details' : 'Failed to save product')
    } else {
      invalidateProducts()
      toast.success(editId ? 'Product updated' : 'Product added')
      closeModal()
      load()
    }
    setSaving(false)
  }

  const confirmDelete = async () => {
    const ids = deleting.bulk ? [...selected] : [deleting.id]
    setBulkBusy(true)
    const { error } = await inBatches(ids, batch => supabase.from('products').delete().in('id', batch))
    setBulkBusy(false)
    if (error) toast.error('Delete failed')
    else {
      invalidateProducts()
      toast.success(ids.length > 1 ? `${ids.length} products deleted` : 'Product deleted')
      if (deleting.bulk) setSelected(new Set())
      load()
    }
    setDeleting(null)
  }

  const toggleFeatured = async p => {
    setProducts(prev => prev.map(x => (x.id === p.id ? { ...x, featured: !p.featured } : x)))
    const { error } = await supabase.from('products').update({ featured: !p.featured }).eq('id', p.id)
    if (error) { toast.error('Could not update'); load() }
    else invalidateProducts()
  }

  const bulkUpdate = async (patch, message) => {
    const ids = [...selected]
    setBulkBusy(true)
    const { error } = await inBatches(ids, batch => supabase.from('products').update(patch).in('id', batch))
    setBulkBusy(false)
    if (error) return toast.error(error.message)
    invalidateProducts()
    toast.success(message(ids.length))
    setSelected(new Set())
    setBulkCategory('')
    load()
  }

  const q = search.toLowerCase()
  const filtered = products.filter(p =>
    (!categoryFilter || (categoryFilter === FEATURED_FILTER ? p.featured : p.category === categoryFilter)) &&
    (p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
  )

  const toggleOne = id => setSelected(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const handleExport = () => {
    const rows = [
      ['Name', 'Category', 'Description', 'Image URL'],
      ...filtered.map(p => [p.name, p.category, p.description || '', p.image_url || ''])
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'products.csv'
    a.click()
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const pageAllSelected = paginated.length > 0 && paginated.every(p => selected.has(p.id))
  const togglePage = () => setSelected(prev => {
    const next = new Set(prev)
    paginated.forEach(p => (pageAllSelected ? next.delete(p.id) : next.add(p.id)))
    return next
  })
  const shortId = id => `#${String(id).slice(0, 8).toUpperCase()}`

  return (
    <div>
      <AdminHeader title="Products" description={`${products.length} product${products.length !== 1 ? 's' : ''} in the catalogue`}>
        <button onClick={handleExport} className="btn-secondary btn-sm">
          <Download size={14} /> Export CSV
        </button>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={14} /> Add product
        </button>
      </AdminHeader>

      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 p-3 border-b border-stone-100">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input h-9 pl-10 rounded-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}
            className="input h-9 rounded-full sm:w-52"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            <option value={FEATURED_FILTER}>★ Featured</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="sm:ml-auto flex items-center gap-2 text-sm text-stone-500">
            <span className="hidden sm:inline">Rows</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="input h-9 w-20 rounded-full"
              aria-label="Rows per page"
            >
              {PAGE_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-stone-900 text-white text-sm">
            <span className="px-2 font-medium tabular-nums">{selected.size} selected</span>
            {selected.size < filtered.length && (
              <button onClick={() => setSelected(new Set(filtered.map(p => p.id)))} className="px-2 text-stone-300 hover:text-white underline-offset-2 hover:underline">
                Select all {filtered.length}
              </button>
            )}
            <span className="hidden sm:block w-px h-5 bg-white/20 mx-1" />
            <select
              value={bulkCategory}
              onChange={e => {
                const cat = e.target.value
                setBulkCategory(cat)
                if (cat) bulkUpdate({ category: cat }, n => `Moved ${n} products to ${cat}`)
              }}
              disabled={bulkBusy}
              className="h-8 rounded-full bg-white/10 text-white text-[13px] px-3 focus:outline-none focus:ring-2 focus:ring-white/40 [&>option]:text-stone-900"
              aria-label="Move to category"
            >
              <option value="">Move to category…</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => bulkUpdate({ featured: true }, n => `Featured ${n} products`)} disabled={bulkBusy} className="h-8 px-3 rounded-full hover:bg-white/10 inline-flex items-center gap-1.5">
              <Star size={13} /> Feature
            </button>
            <button onClick={() => bulkUpdate({ featured: false }, n => `Unfeatured ${n} products`)} disabled={bulkBusy} className="h-8 px-3 rounded-full hover:bg-white/10">
              Unfeature
            </button>
            <button onClick={() => setDeleting({ bulk: true })} disabled={bulkBusy} className="h-8 px-3 rounded-full text-red-300 hover:bg-red-500/20 hover:text-red-200 inline-flex items-center gap-1.5">
              <Trash2 size={13} /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="ml-auto h-8 w-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="Clear selection">
              <X size={15} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 bg-stone-50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <EmptyIcon />
            <p className="text-stone-500 text-sm mb-6">
              {products.length === 0 ? 'No products yet.' : 'No products match your filters.'}
            </p>
            {products.length === 0
              ? <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={14} /> Add your first product</button>
              : <button onClick={() => { setSearch(''); setCategoryFilter(''); setPage(1) }} className="btn-secondary btn-sm">Clear filters</button>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-stone-500 border-b border-stone-100">
                    <th className="pl-5 w-8 h-11">
                      <input type="checkbox" checked={pageAllSelected} onChange={togglePage} className="h-4 w-4 accent-stone-900 align-middle" aria-label="Select all on this page" />
                    </th>
                    <th className="pl-3 pr-4 h-11 font-medium">Product</th>
                    <th className="px-4 h-11 font-medium hidden sm:table-cell">ID</th>
                    <th className="px-4 h-11 font-medium hidden md:table-cell">Category</th>
                    <th className="px-4 h-11 font-medium hidden lg:table-cell">Description</th>
                    <th className="pl-4 pr-5 h-11 font-medium text-right"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginated.map(p => (
                    <tr key={p.id} className={`transition-colors ${selected.has(p.id) ? 'bg-clay-50/60' : 'hover:bg-stone-50/70'}`}>
                      <td className="pl-5 py-3">
                        <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} className="h-4 w-4 accent-stone-900 align-middle" aria-label={`Select ${p.name}`} />
                      </td>
                      <td className="pl-3 pr-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image_url
                            ? <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-stone-100" />
                            : <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0 grid place-items-center text-stone-400"><ImageIcon size={16} /></div>}
                          <span className="font-medium text-stone-900">{p.name}</span>
                          {p.sort_order != null && <span className="text-[11px] text-stone-400 tabular-nums" title="Position">#{p.sort_order}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-stone-400 text-xs font-mono">{shortId(p.id)}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="chip">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-stone-500 max-w-xs">
                        <span className="line-clamp-1 text-xs">{p.description || '—'}</span>
                      </td>
                      <td className="pl-4 pr-5 py-3">
                        <div className="flex items-center gap-0.5 justify-end">
                          <button
                            onClick={() => toggleFeatured(p)}
                            className={`icon-btn ${p.featured ? '!text-amber-500' : ''}`}
                            aria-label={p.featured ? `Unfeature ${p.name}` : `Feature ${p.name}`}
                            title={p.featured ? 'Featured — click to remove' : 'Feature on home page'}
                          >
                            <Star size={15} fill={p.featured ? 'currentColor' : 'none'} />
                          </button>
                          <a href={productPath(p)} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`View ${p.name}`}>
                            <ExternalLink size={15} />
                          </a>
                          <button onClick={() => openEdit(p)} className="icon-btn" aria-label={`Edit ${p.name}`}>
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleting(p)} className="icon-btn hover:!text-red-600 hover:!bg-red-50" aria-label={`Delete ${p.name}`}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              className="px-5 py-3 border-t border-stone-100"
            />
          </>
        )}
      </div>

      {/* Add / edit */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editId ? 'Edit product' : 'Add product'}
        size="lg"
        footer={
          <>
            <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
            <button type="submit" form="product-form" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : editId ? 'Save changes' : 'Add product'}
            </button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="label" htmlFor="p-name">Name</label>
            <input
              id="p-name"
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. Djembe Drum"
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="p-cat">Category</label>
            <select
              id="p-cat"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              required
              className="input"
            >
              <option value="">Select category</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="p-desc">Description</label>
            <textarea
              id="p-desc"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Describe this product…"
              className="input resize-none"
            />
          </div>
          <div>
            <span className="label">Image</span>
            <div className="flex gap-4">
              <div className="relative h-24 w-24 shrink-0 rounded-xl bg-stone-100 overflow-hidden grid place-items-center text-stone-400">
                {form.image_url
                  ? <>
                      <img src={form.image_url} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                        className="absolute top-1 right-1 grid place-items-center h-6 w-6 rounded-full bg-white/90 text-stone-700 hover:bg-white"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </>
                  : <ImageIcon size={20} />}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="Paste image URL"
                  className="input"
                />
                <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="btn-secondary btn-sm w-full"
                >
                  <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload from device'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <span className="label">More photos <span className="text-stone-400 font-normal">(gallery on the product page)</span></span>
            <div className="grid grid-cols-5 gap-2">
              {form.images.map((src, i) => (
                <div key={src + i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    className="absolute top-1 right-1 grid place-items-center h-6 w-6 rounded-full bg-white/90 text-stone-700 hover:bg-white"
                    aria-label="Remove photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <input type="file" accept="image/*" multiple ref={galleryRef} onChange={handleGalleryUpload} className="hidden" />
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border border-dashed border-stone-300 text-stone-400 hover:text-stone-900 hover:border-stone-400 grid place-items-center transition-colors"
                aria-label="Add photos"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="pt-5 border-t border-stone-100">
            <p className="text-sm font-medium text-stone-900 mb-4">Details <span className="text-stone-400 font-normal">— shown on the product page and catalogue</span></p>
            <div className="grid sm:grid-cols-2 gap-4">
              {DETAIL_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="label" htmlFor={`p-${key}`}>{label}</label>
                  <input
                    id={`p-${key}`}
                    type="text"
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-stone-100 grid sm:grid-cols-2 gap-4 items-end">
            <label className="flex items-center gap-3 h-11 px-4 rounded-xl ring-1 ring-inset ring-stone-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="h-4 w-4 accent-stone-900"
              />
              <span className="text-sm text-stone-700">Featured on the home page</span>
            </label>
            <div>
              <label className="label" htmlFor="p-sort">Position <span className="text-stone-400 font-normal">(lower shows first)</span></label>
              <input
                id="p-sort"
                type="number"
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                placeholder="Automatic"
                className="input"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={deleting?.bulk ? `Delete ${selected.size} products` : 'Delete product'}
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="btn-ghost">Cancel</button>
            <button onClick={confirmDelete} disabled={bulkBusy} className="btn-danger">
              {bulkBusy ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="p-6 text-sm text-stone-600">
          {deleting?.bulk
            ? <>Delete <span className="font-medium text-stone-900">{selected.size} selected products</span>? This can't be undone.</>
            : <>Are you sure you want to delete <span className="font-medium text-stone-900">{deleting?.name}</span>? This can't be undone.</>}
        </p>
      </Modal>
    </div>
  )
}

function EmptyIcon() {
  return (
    <span className="mx-auto mb-4 grid place-items-center h-12 w-12 rounded-full bg-stone-100 text-stone-400">
      <ImageIcon size={20} />
    </span>
  )
}
