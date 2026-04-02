import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const CATEGORIES = ['Musical Instruments', 'Baskets & Weaving', 'Wood Carvings', 'Textiles & Fashion', 'Gifts & Souvenirs']
const EMPTY_FORM = { name: '', category: '', description: '', image_url: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true) }
  const openEdit = p => { setForm({ name: p.name, category: p.category, description: p.description || '', image_url: p.image_url || '' }); setEditId(p.id); setShowModal(true) }
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-earth-900">Products</h1>
          <p className="text-earth-500 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9 py-2 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-earth-50 animate-pulse rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-earth-400">No products found.</p>
            <button onClick={openAdd} className="btn-primary mt-4">
              <Plus size={18} /> Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-earth-50 text-earth-500 text-left">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-earth-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url && (
                          <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <span className="font-medium text-earth-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="badge">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-earth-500 hidden lg:table-cell max-w-xs">
                      <span className="line-clamp-1">{p.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-earth-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-earth-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100">
              <h2 className="font-display font-bold text-lg text-earth-900">
                {editId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={closeModal} className="text-earth-400 hover:text-earth-700 p-1">
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
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="Paste image URL or upload below"
                    className="input-field flex-1"
                  />
                </div>
                <div className="mt-2">
                  <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 text-sm text-earth-500 hover:text-brand-600 border border-dashed border-earth-200 rounded-lg px-4 py-2 hover:border-brand-400 transition-colors w-full justify-center"
                  >
                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload from device'}
                  </button>
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-3 h-24 w-24 object-cover rounded-lg" />
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
