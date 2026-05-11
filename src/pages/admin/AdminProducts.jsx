import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const CATEGORIES = ['Musical Instruments', 'Baskets & Weaving', 'Wood Carvings', 'Textiles & Fashion', 'Gifts & Souvenirs']
const EMPTY_FORM = { name: '', category: '', description: '', image_url: '' }
const PAGE_SIZES = [10, 25, 50]

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages)
  } else if (page >= totalPages - 3) {
    pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
  }

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-earth-100">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 text-sm text-earth-500 hover:text-earth-900 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg border border-earth-200 hover:bg-earth-50 transition-colors"
      >
        <ChevronLeft size={14} /> Previous
      </button>
      <div className="flex items-center gap-1">
        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' && onChange(p)}
            className={`w-8 h-8 text-sm rounded-lg transition-colors font-medium ${
              p === page
                ? 'bg-[#3B1F0A] text-[#F5A200]'
                : typeof p === 'number'
                ? 'text-earth-500 hover:bg-earth-100'
                : 'text-earth-300 cursor-default'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 text-sm text-earth-500 hover:text-earth-900 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg border border-earth-200 hover:bg-earth-50 transition-colors"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const fileRef = useRef()

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])
  useEffect(() => { setPage(1) }, [search, pageSize])

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true) }
  const openEdit = p => {
    setForm({ name: p.name, category: p.category, description: p.description || '', image_url: p.image_url || '' })
    setEditId(p.id)
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setEditId(null) }

  const handleUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(path, file)
    if (error) {
      toast.error('Upload failed')
    } else {
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      setForm(f => ({ ...f, image_url: data.publicUrl }))
      toast.success('Image uploaded')
    }
    setUploading(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, category: form.category, description: form.description, image_url: form.image_url }
    let error
    if (editId) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('products').insert([payload]))
    }
    if (error) {
      toast.error('Failed to save product')
    } else {
      toast.success(editId ? 'Product updated' : 'Product added')
      closeModal()
      load()
    }
    setSaving(false)
  }

  const handleDelete = async id => {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error('Delete failed')
    else { toast.success('Product deleted'); load() }
  }

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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const shortId = id => `#${String(id).slice(0, 8).toUpperCase()}`

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="font-display text-2xl font-bold text-earth-900">Product</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-earth-600 border border-earth-200 rounded-lg px-3 py-2 bg-white">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="border-0 focus:outline-none text-earth-800 font-semibold bg-transparent cursor-pointer"
            >
              {PAGE_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-2 text-sm text-earth-600 border border-earth-200 rounded-lg px-4 py-2 bg-white hover:bg-earth-50 transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 text-sm text-earth-600 border border-earth-200 rounded-lg px-4 py-2 bg-white hover:bg-earth-50 transition-colors">
            <Download size={14} /> Export
          </button>
          <button onClick={openAdd} className="btn-primary text-sm py-2">
            <Plus size={15} /> Add New Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9 py-2 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-earth-50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <p className="text-earth-400 mb-4">No products found.</p>
            <button onClick={openAdd} className="btn-primary text-sm">
              <Plus size={15} /> Add your first product
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-earth-100 text-earth-400 text-left text-xs uppercase tracking-wide">
                    <th className="px-5 py-3.5 font-medium">Product Name</th>
                    <th className="px-4 py-3.5 font-medium hidden sm:table-cell">Product ID</th>
                    <th className="px-4 py-3.5 font-medium hidden md:table-cell">Category</th>
                    <th className="px-4 py-3.5 font-medium hidden lg:table-cell">Description</th>
                    <th className="px-4 py-3.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-50">
                  {paginated.map(p => (
                    <tr key={p.id} className="hover:bg-earth-50/50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-earth-100" />
                            : <div className="w-10 h-10 rounded-xl bg-earth-100 shrink-0" />
                          }
                          <span className="font-semibold text-earth-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-earth-400 text-xs font-mono">{shortId(p.id)}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="badge">{p.category}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-earth-400 max-w-xs">
                        <span className="line-clamp-1 text-xs">{p.description || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-2 text-earth-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-earth-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100">
              <h2 className="font-display font-bold text-lg text-earth-900">
                {editId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={closeModal} className="text-earth-400 hover:text-earth-700 p-1 rounded-lg hover:bg-earth-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="e.g. Djembe Drum"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  required
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe this product..."
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Product Image</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="Paste image URL or upload below"
                  className="input-field"
                />
                <div className="mt-2">
                  <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 text-sm text-earth-500 hover:text-brand-600 border border-dashed border-earth-200 rounded-lg px-4 py-2.5 hover:border-brand-400 transition-colors w-full justify-center"
                  >
                    <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload from device'}
                  </button>
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-3 h-24 w-24 object-cover rounded-xl border border-earth-100" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center">
                  {saving ? 'Saving...' : editId ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
