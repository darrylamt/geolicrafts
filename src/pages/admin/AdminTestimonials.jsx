import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Upload, Quote, ImageIcon, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { invalidateContent } from '../../lib/content'
import { uploadImage } from '../../lib/upload'
import AdminHeader from '../../components/ui/AdminHeader'
import Modal from '../../components/ui/Modal'

const KINDS = {
  testimonials: {
    label: 'Testimonials',
    singular: 'testimonial',
    empty: { quote: '', name: '', role: '', company: '', country: '', published: true },
    fields: [
      { key: 'quote', label: 'Quote', textarea: true, required: true, placeholder: 'What did they say about working with Geolicrafts?' },
      { key: 'name', label: 'Name', required: true, placeholder: 'Anna Schmidt' },
      { key: 'role', label: 'Role', placeholder: 'Owner' },
      { key: 'company', label: 'Company', placeholder: 'Trommelhaus Berlin' },
      { key: 'country', label: 'Country', placeholder: 'Germany' },
    ],
  },
  partners: {
    label: 'Partner logos',
    singular: 'partner',
    empty: { name: '', logo_url: '', website: '', published: true },
    fields: [
      { key: 'name', label: 'Name', required: true, placeholder: 'Retailer name' },
      { key: 'logo_url', label: 'Logo', image: true, required: true },
      { key: 'website', label: 'Website', placeholder: 'https://…', type: 'url' },
    ],
  },
}

export default function AdminTestimonials() {
  const [kind, setKind] = useState('testimonials')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [form, setForm] = useState(null) // null = closed
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const fileRef = useRef()
  const cfg = KINDS[kind]

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(kind).select('*').order('sort_order').order('created_at')
    setMissing(!!error)
    setRows(data || [])
    setLoading(false)
  }, [kind])

  useEffect(() => { load() }, [load])

  const changed = () => { invalidateContent(kind); return load() }

  const save = async e => {
    e.preventDefault()
    setSaving(true)
    const payload = Object.fromEntries([...cfg.fields.map(f => [f.key, form[f.key]?.trim?.() ?? form[f.key]]), ['published', form.published]])
    for (const f of cfg.fields) if (!f.required && payload[f.key] === '') payload[f.key] = null
    const { error } = form.id
      ? await supabase.from(kind).update(payload).eq('id', form.id)
      : await supabase.from(kind).insert([{ ...payload, sort_order: (rows.at(-1)?.sort_order || 0) + 10 }])
    setSaving(false)
    if (error) return toast.error(error.message)
    toast.success(form.id ? 'Saved' : 'Added')
    setForm(null)
    changed()
  }

  const togglePublished = async row => {
    const { error } = await supabase.from(kind).update({ published: !row.published }).eq('id', row.id)
    if (error) return toast.error(error.message)
    changed()
  }

  const move = async (index, dir) => {
    const next = [...rows]
    const [item] = next.splice(index, 1)
    next.splice(index + dir, 0, item)
    setRows(next)
    await Promise.all(next.map((r, i) => supabase.from(kind).update({ sort_order: (i + 1) * 10 }).eq('id', r.id)))
    changed()
  }

  const confirmDelete = async () => {
    const { error } = await supabase.from(kind).delete().eq('id', deleting.id)
    if (error) return toast.error(error.message)
    toast.success('Deleted')
    setDeleting(null)
    changed()
  }

  const handleLogo = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file, 'partners')
    setUploading(false)
    e.target.value = ''
    if (!url) return toast.error('Upload failed')
    setForm(f => ({ ...f, logo_url: url }))
  }

  return (
    <div className="max-w-4xl">
      <AdminHeader
        title="Testimonials"
        description="Quotes from buyers and partner logos. The home page section only appears once something is published here."
      >
        <button onClick={() => setForm({ ...cfg.empty })} disabled={missing} className="btn-primary btn-sm">
          <Plus size={14} /> Add {cfg.singular}
        </button>
      </AdminHeader>

      <div className="inline-flex p-1 rounded-full bg-stone-100 mb-6">
        {Object.entries(KINDS).map(([key, k]) => (
          <button
            key={key}
            onClick={() => { if (key !== kind) { setKind(key); setLoading(true) } }}
            className={`h-8 px-4 rounded-full text-sm transition-all ${
              kind === key ? 'bg-white text-stone-900 font-medium shadow-sm' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {missing && !loading && (
        <div className="flex gap-3 rounded-2xl bg-amber-50 ring-1 ring-amber-200 p-4 mb-6 text-sm text-amber-900">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p>Run <code className="font-mono text-xs">supabase/migrations/004_categories_featured_testimonials.sql</code> in the Supabase SQL Editor to enable this page.</p>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-stone-50 animate-pulse rounded-xl" />)}</div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <span className="mx-auto mb-4 grid place-items-center h-12 w-12 rounded-full bg-stone-100 text-stone-400">
              {kind === 'testimonials' ? <Quote size={20} /> : <ImageIcon size={20} />}
            </span>
            <p className="text-sm text-stone-500">No {cfg.label.toLowerCase()} yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {rows.map((row, i) => (
              <li key={row.id} className={`flex items-center gap-4 pl-5 pr-3 py-4 ${row.published ? '' : 'opacity-50'}`}>
                {kind === 'partners' ? (
                  <img src={row.logo_url} alt="" className="h-10 w-20 object-contain shrink-0" />
                ) : null}
                <div className="flex-1 min-w-0">
                  {kind === 'testimonials' ? (
                    <>
                      <p className="text-sm text-stone-900 line-clamp-2">“{row.quote}”</p>
                      <p className="text-xs text-stone-500 mt-1">{[row.name, row.role, row.company, row.country].filter(Boolean).join(' · ')}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-stone-900">{row.name}</p>
                      {row.website && <p className="text-xs text-stone-500 truncate">{row.website}</p>}
                    </>
                  )}
                </div>
                <div className="flex items-center shrink-0">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="icon-btn" aria-label="Move up"><ArrowUp size={15} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="icon-btn" aria-label="Move down"><ArrowDown size={15} /></button>
                  <button onClick={() => togglePublished(row)} className="icon-btn" aria-label={row.published ? 'Hide' : 'Show'} title={row.published ? 'Hide from site' : 'Show on site'}>
                    {row.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => setForm({ ...cfg.empty, ...row })} className="icon-btn" aria-label="Edit"><Pencil size={15} /></button>
                  <button onClick={() => setDeleting(row)} className="icon-btn hover:!text-red-600 hover:!bg-red-50" aria-label="Delete"><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title={`${form?.id ? 'Edit' : 'Add'} ${cfg.singular}`}
        footer={
          <>
            <label className="mr-auto flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form?.published}
                onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                className="h-4 w-4 accent-stone-900"
              />
              Show on site
            </label>
            <button onClick={() => setForm(null)} className="btn-ghost">Cancel</button>
            <button type="submit" form="testimonial-form" disabled={saving || uploading} className="btn-primary">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        {form && (
          <form id="testimonial-form" onSubmit={save} className="p-6 space-y-5">
            {cfg.fields.map(f => (
              <div key={f.key}>
                <label className="label" htmlFor={`t-${f.key}`}>{f.label}</label>
                {f.textarea ? (
                  <textarea id={`t-${f.key}`} rows={4} required={f.required} maxLength={600} value={form[f.key] || ''} placeholder={f.placeholder}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} className="input resize-none" />
                ) : f.image ? (
                  <div className="flex gap-3 items-center">
                    <div className="h-16 w-32 shrink-0 rounded-xl bg-stone-100 grid place-items-center overflow-hidden">
                      {form[f.key] ? <img src={form[f.key]} alt="" className="max-h-full max-w-full object-contain" /> : <ImageIcon size={18} className="text-stone-400" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input id={`t-${f.key}`} type="url" required={f.required} value={form[f.key] || ''} placeholder="Paste logo URL"
                        onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} className="input" />
                      <input type="file" accept="image/*" ref={fileRef} onChange={handleLogo} className="hidden" />
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-secondary btn-sm w-full">
                        <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload logo'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <input id={`t-${f.key}`} type={f.type || 'text'} required={f.required} maxLength={200} value={form[f.key] || ''} placeholder={f.placeholder}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} className="input" />
                )}
              </div>
            ))}
            <p className="text-xs text-stone-400">Only publish real quotes, with the buyer's permission.</p>
          </form>
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Delete ${cfg.singular}`}
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="btn-ghost">Cancel</button>
            <button onClick={confirmDelete} className="btn-danger">Delete</button>
          </>
        }
      >
        <p className="p-6 text-sm text-stone-600">This can't be undone.</p>
      </Modal>
    </div>
  )
}
