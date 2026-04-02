import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const CATEGORIES = ['News', 'Crafts', 'Community', 'Events', 'Training']
const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', content: '', category: '',
  image_url: '', published: false, read_time: 3,
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('write')

  const load = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); setTab('write') }
  const openEdit = p => {
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || '', content: p.content || '',
      category: p.category || '', image_url: p.image_url || '', published: p.published || false,
      read_time: p.read_time || 3,
    })
    setEditId(p.id)
    setShowModal(true)
    setTab('write')
  }
  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setEditId(null) }

  const handleTitleChange = e => {
    const title = e.target.value
    setForm(f => ({ ...f, title, slug: editId ? f.slug : slugify(title) }))
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      image_url: form.image_url,
      published: form.published,
      read_time: Number(form.read_time),
      published_at: form.published ? new Date().toISOString() : null,
    }
    let error
    if (editId) {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('blog_posts').insert([payload]))
    }
    if (error) toast.error('Failed to save post')
    else { toast.success(editId ? 'Post updated' : 'Post created'); closeModal(); load() }
    setSaving(false)
  }

  const handleDelete = async id => {
    if (!confirm('Delete this post?')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) toast.error('Delete failed')
    else { toast.success('Post deleted'); load() }
  }

  const togglePublish = async (p) => {
    const { error } = await supabase.from('blog_posts')
      .update({ published: !p.published, published_at: !p.published ? new Date().toISOString() : null })
      .eq('id', p.id)
    if (error) toast.error('Failed to update')
    else { toast.success(!p.published ? 'Published' : 'Unpublished'); load() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-earth-900">Blog Posts</h1>
          <p className="text-earth-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-earth-50 animate-pulse rounded-lg" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-earth-400">No posts yet.</p>
            <button onClick={openAdd} className="btn-primary mt-4"><Plus size={18} /> Write first post</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-earth-50 text-earth-500 text-left">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-50">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-earth-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-earth-900 line-clamp-1">{p.title}</span>
                      <span className="text-earth-400 text-xs block">/blog/{p.slug}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="badge">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.published ? 'bg-green-100 text-green-700' : 'bg-earth-100 text-earth-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.published ? 'bg-green-500' : 'bg-earth-400'}`} />
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-earth-400 hidden lg:table-cell text-xs">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => togglePublish(p)}
                          className={`p-2 rounded-lg transition-colors ${
                            p.published
                              ? 'text-earth-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-earth-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={p.published ? 'Unpublish' : 'Publish'}
                        >
                          {p.published ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100 sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-lg text-earth-900">
                {editId ? 'Edit Post' : 'New Post'}
              </h2>
              <button onClick={closeModal} className="text-earth-400 hover:text-earth-700 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleTitleChange}
                  required
                  placeholder="Post title..."
                  className="input-field text-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    required
                    placeholder="url-slug"
                    className="input-field font-mono text-sm"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Cover Image URL</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://..."
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Read Time (min)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={form.read_time}
                    onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  placeholder="Short summary shown in blog list..."
                  className="input-field resize-none"
                />
              </div>

              {/* Content tabs */}
              <div>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setTab('write')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === 'write' ? 'bg-brand-600 text-white' : 'bg-earth-100 text-earth-600'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('preview')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === 'preview' ? 'bg-brand-600 text-white' : 'bg-earth-100 text-earth-600'
                    }`}
                  >
                    Preview
                  </button>
                </div>
                <label className="block text-sm font-medium text-earth-700 mb-1.5">Content</label>
                {tab === 'write' ? (
                  <textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={14}
                    placeholder="Write your post content here. Use ## for headings, **bold** for bold text, and - for bullet lists."
                    className="input-field resize-y font-mono text-sm"
                  />
                ) : (
                  <div className="border border-earth-200 rounded-lg p-4 min-h-[14rem] bg-earth-50 text-sm prose-custom overflow-y-auto">
                    {form.content ? (
                      form.content.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(3)}</h2>
                        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>
                        if (line.trim() === '') return <br key={i} />
                        return <p key={i} className="mb-2">{line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}</p>
                      })
                    ) : <p className="text-earth-400">Nothing to preview yet...</p>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-brand-600"
                />
                <label htmlFor="published" className="text-sm font-medium text-earth-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-white py-4 -mx-6 px-6 border-t border-earth-100">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center">
                  {saving ? 'Saving...' : editId ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
