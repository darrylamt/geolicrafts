import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, BookOpen } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/ui/AdminHeader'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

const CATEGORIES = ['News', 'Crafts', 'Community', 'Events', 'Training']
const PAGE_SIZE = 10
const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', content: '', category: '',
  image_url: '', published: false, published_at: null, read_time: 3,
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex p-1 rounded-full bg-stone-100">
      {options.map(o => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={`h-7 px-3.5 rounded-full text-[13px] transition-all ${
            value === o.key ? 'bg-white text-stone-900 font-medium shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('write')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(null)

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
      published_at: p.published_at || null,
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
      // Keep the original publish date when editing; only stamp it the first time a post goes live
      published_at: form.published ? (form.published_at || new Date().toISOString()) : form.published_at,
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

  const confirmDelete = async () => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleting.id)
    if (error) toast.error('Delete failed')
    else { toast.success('Post deleted'); load() }
    setDeleting(null)
  }

  const togglePublish = async (p) => {
    const { error } = await supabase.from('blog_posts')
      .update({ published: !p.published, published_at: p.published_at || new Date().toISOString() })
      .eq('id', p.id)
    if (error) toast.error('Failed to update')
    else { toast.success(!p.published ? 'Published' : 'Unpublished'); load() }
  }

  const q = search.toLowerCase()
  const filtered = posts.filter(p =>
    (status === 'all' || (status === 'published' ? p.published : !p.published)) &&
    (p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const publishedCount = posts.filter(p => p.published).length

  return (
    <div>
      <AdminHeader title="Blog posts" description={`${publishedCount} published · ${posts.length - publishedCount} draft${posts.length - publishedCount !== 1 ? 's' : ''}`}>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={14} /> New post
        </button>
      </AdminHeader>

      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border-b border-stone-100">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input h-9 pl-10 rounded-full"
            />
          </div>
          <div className="sm:ml-auto">
            <Segmented
              value={status}
              onChange={s => { setStatus(s); setPage(1) }}
              options={[
                { key: 'all', label: 'All' },
                { key: 'published', label: 'Published' },
                { key: 'draft', label: 'Drafts' },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-stone-50 animate-pulse rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="mx-auto mb-4 grid place-items-center h-12 w-12 rounded-full bg-stone-100 text-stone-400">
              <BookOpen size={20} />
            </span>
            <p className="text-sm text-stone-500 mb-6">{posts.length === 0 ? 'No posts yet.' : 'No posts match your filters.'}</p>
            {posts.length === 0 && <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={14} /> Write your first post</button>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-stone-500 border-b border-stone-100">
                    <th className="pl-5 pr-4 h-11 font-medium">Title</th>
                    <th className="px-4 h-11 font-medium hidden md:table-cell">Category</th>
                    <th className="px-4 h-11 font-medium hidden md:table-cell">Status</th>
                    <th className="px-4 h-11 font-medium hidden lg:table-cell">Published</th>
                    <th className="pl-4 pr-5 h-11"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginated.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="pl-5 pr-4 py-3 max-w-md">
                        <button onClick={() => openEdit(p)} className="text-left">
                          <span className="font-medium text-stone-900 line-clamp-1 hover:text-clay-700 transition-colors">{p.title}</span>
                          <span className="text-stone-400 text-xs font-mono block mt-0.5 truncate">/blog/{p.slug}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="chip">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          p.published ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.published ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-500 hidden lg:table-cell text-xs tabular-nums">
                        {p.published_at ? new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="pl-4 pr-5 py-3">
                        <div className="flex items-center gap-0.5 justify-end">
                          <button
                            onClick={() => togglePublish(p)}
                            className="icon-btn"
                            title={p.published ? 'Unpublish' : 'Publish'}
                            aria-label={p.published ? 'Unpublish' : 'Publish'}
                          >
                            {p.published ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <button onClick={() => openEdit(p)} className="icon-btn" aria-label="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleting(p)} className="icon-btn hover:!text-red-600 hover:!bg-red-50" aria-label="Delete">
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
              pageSize={PAGE_SIZE}
              className="px-5 py-3 border-t border-stone-100"
            />
          </>
        )}
      </div>

      {/* Editor */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editId ? 'Edit post' : 'New post'}
        size="lg"
        footer={
          <>
            <label className="mr-auto flex items-center gap-3 cursor-pointer select-none">
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="peer sr-only"
                />
                <span className="h-6 w-10 rounded-full bg-stone-200 peer-checked:bg-stone-900 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-clay-500 peer-focus-visible:ring-offset-2" />
                <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </span>
              <span className="text-sm text-stone-700">Publish</span>
            </label>
            <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
            <button type="submit" form="post-form" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : editId ? 'Save changes' : 'Create post'}
            </button>
          </>
        }
      >
        <form id="post-form" onSubmit={handleSave} className="p-6 space-y-5">
          <input
            type="text"
            value={form.title}
            onChange={handleTitleChange}
            required
            placeholder="Post title"
            aria-label="Title"
            className="w-full font-display text-4xl text-stone-900 placeholder:text-stone-300 focus:outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="b-slug">Slug</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-mono pointer-events-none">/blog/</span>
                <input
                  id="b-slug"
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  required
                  placeholder="url-slug"
                  className="input font-mono pl-[4.25rem]"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="b-cat">Category</label>
              <select
                id="b-cat"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                required
                className="input"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="b-img">Cover image URL</label>
              <input
                id="b-img"
                type="url"
                value={form.image_url}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="https://…"
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="b-rt">Read time (min)</label>
              <input
                id="b-rt"
                type="number"
                min={1}
                max={60}
                value={form.read_time}
                onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="b-ex">Excerpt</label>
            <textarea
              id="b-ex"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              placeholder="Short summary shown in the journal list…"
              className="input resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label mb-0">Content</span>
              <Segmented
                value={tab}
                onChange={setTab}
                options={[{ key: 'write', label: 'Write' }, { key: 'preview', label: 'Preview' }]}
              />
            </div>
            {tab === 'write' ? (
              <>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={14}
                  placeholder="Write your post here…"
                  className="input resize-y font-mono text-[13px]"
                />
                <p className="text-xs text-stone-400 mt-2">
                  <code>## Heading</code> · <code>**bold**</code> · <code>- list item</code> · <code>![alt](url "caption")</code> · <code>[gallery]/a.jpg,/b.jpg</code>
                </p>
              </>
            ) : (
              <div className="rounded-xl ring-1 ring-stone-200 p-5 min-h-[14rem] bg-stone-50 text-sm overflow-y-auto">
                {form.content ? (
                  form.content.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl mt-4 mb-2">{line.slice(3)}</h2>
                    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-stone-700">{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                    if (line.trim() === '') return <br key={i} />
                    return <p key={i} className="mb-2 text-stone-700">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                  })
                ) : <p className="text-stone-400">Nothing to preview yet…</p>}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete post"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="btn-ghost">Cancel</button>
            <button onClick={confirmDelete} className="btn-danger">Delete</button>
          </>
        }
      >
        <p className="p-6 text-sm text-stone-600">
          Delete <span className="font-medium text-stone-900">{deleting?.title}</span>? This can't be undone.
        </p>
      </Modal>
    </div>
  )
}
