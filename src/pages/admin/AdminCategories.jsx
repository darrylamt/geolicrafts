import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Check, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { invalidateContent } from '../../lib/content'
import { invalidateProducts } from '../../lib/products'
import AdminHeader from '../../components/ui/AdminHeader'
import Modal from '../../components/ui/Modal'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [missingTable, setMissingTable] = useState(false)
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState(null) // { id, name }
  const [deleting, setDeleting] = useState(null)
  const [reassignTo, setReassignTo] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const [cats, prods] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order').order('name'),
      supabase.from('products').select('category'),
    ])
    setMissingTable(!!cats.error)
    setCategories(cats.data || [])
    const c = {}
    for (const p of prods.data || []) c[p.category] = (c[p.category] || 0) + 1
    setCounts(c)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const changed = () => {
    invalidateContent('categories')
    invalidateProducts()
    return load()
  }

  // Categories used by products but missing from the list
  const orphans = Object.keys(counts).filter(name => name && !categories.some(c => c.name === name))

  const add = async (name = newName.trim()) => {
    if (!name) return
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return toast.error('That category already exists')
    const sort_order = (categories.at(-1)?.sort_order || 0) + 10
    const { error } = await supabase.from('categories').insert([{ name, sort_order }])
    if (error) return toast.error(error.message)
    setNewName('')
    toast.success(`Added “${name}”`)
    changed()
  }

  const rename = async () => {
    const name = editing.name.trim()
    const old = categories.find(c => c.id === editing.id)
    if (!name || name === old.name) return setEditing(null)
    if (categories.some(c => c.id !== old.id && c.name.toLowerCase() === name.toLowerCase())) return toast.error('That category already exists')
    setBusy(true)
    const { error } = await supabase.from('categories').update({ name }).eq('id', old.id)
    if (!error) await supabase.from('products').update({ category: name }).eq('category', old.name)
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success(`Renamed to “${name}” — ${counts[old.name] || 0} products updated`)
    setEditing(null)
    changed()
  }

  const move = async (index, dir) => {
    const next = [...categories]
    const [item] = next.splice(index, 1)
    next.splice(index + dir, 0, item)
    setCategories(next)
    const results = await Promise.all(
      next.map((c, i) => supabase.from('categories').update({ sort_order: (i + 1) * 10 }).eq('id', c.id))
    )
    if (results.some(r => r.error)) toast.error('Could not save the new order')
    changed()
  }

  const confirmDelete = async () => {
    const count = counts[deleting.name] || 0
    if (count > 0 && !reassignTo) return
    setBusy(true)
    if (count > 0) {
      const { error } = await supabase.from('products').update({ category: reassignTo }).eq('category', deleting.name)
      if (error) { setBusy(false); return toast.error(error.message) }
    }
    const { error } = await supabase.from('categories').delete().eq('id', deleting.id)
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success(count ? `Deleted — ${count} products moved to “${reassignTo}”` : 'Category deleted')
    setDeleting(null)
    changed()
  }

  return (
    <div className="max-w-3xl">
      <AdminHeader title="Categories" description="Control which categories exist and the order they appear in on the site." />

      {missingTable && !loading && (
        <div className="flex gap-3 rounded-2xl bg-amber-50 ring-1 ring-amber-200 p-4 mb-6 text-sm text-amber-900">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p>
            The categories table doesn't exist yet. Run <code className="font-mono text-xs">supabase/migrations/004_categories_featured_testimonials.sql</code> in
            the Supabase SQL Editor — until then the site uses the built-in category list.
          </p>
        </div>
      )}

      <div className="card overflow-hidden">
        <form
          onSubmit={e => { e.preventDefault(); add() }}
          className="flex gap-2 p-3 border-b border-stone-100"
        >
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="New category name"
            maxLength={60}
            disabled={missingTable}
            className="input h-9 rounded-full flex-1"
          />
          <button type="submit" disabled={!newName.trim() || missingTable} className="btn-primary btn-sm">
            <Plus size={14} /> Add
          </button>
        </form>

        {loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-stone-50 animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {categories.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 pl-5 pr-3 h-14">
                <span className="w-6 text-xs text-stone-400 tabular-nums">{i + 1}</span>
                {editing?.id === c.id ? (
                  <form onSubmit={e => { e.preventDefault(); rename() }} className="flex-1 flex items-center gap-1">
                    <input
                      autoFocus
                      value={editing.name}
                      onChange={e => setEditing({ ...editing, name: e.target.value })}
                      onKeyDown={e => e.key === 'Escape' && setEditing(null)}
                      maxLength={60}
                      className="input h-9 rounded-full flex-1"
                    />
                    <button type="submit" disabled={busy} className="icon-btn" aria-label="Save"><Check size={16} /></button>
                    <button type="button" onClick={() => setEditing(null)} className="icon-btn" aria-label="Cancel"><X size={16} /></button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1 min-w-0 truncate font-medium text-stone-900">{c.name}</span>
                    <span className="chip tabular-nums">{counts[c.name] || 0} products</span>
                    <div className="flex items-center">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="icon-btn" aria-label="Move up"><ArrowUp size={15} /></button>
                      <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} className="icon-btn" aria-label="Move down"><ArrowDown size={15} /></button>
                      <button onClick={() => setEditing({ id: c.id, name: c.name })} className="icon-btn" aria-label={`Rename ${c.name}`}><Pencil size={15} /></button>
                      <button onClick={() => { setDeleting(c); setReassignTo('') }} className="icon-btn hover:!text-red-600 hover:!bg-red-50" aria-label={`Delete ${c.name}`}><Trash2 size={15} /></button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {categories.length === 0 && !missingTable && (
              <li className="py-12 text-center text-sm text-stone-500">No categories yet.</li>
            )}
          </ul>
        )}
      </div>

      {orphans.length > 0 && !missingTable && (
        <div className="card mt-6 p-5">
          <p className="text-sm font-medium text-stone-900 mb-1">Used by products but not in the list</p>
          <p className="text-xs text-stone-500 mb-4">These still show on the site (after the listed ones). Add them to control their order.</p>
          <div className="flex flex-wrap gap-2">
            {orphans.map(name => (
              <button key={name} onClick={() => add(name)} className="btn-secondary btn-sm">
                <Plus size={13} /> {name} <span className="text-stone-400">({counts[name]})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete category"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="btn-ghost">Cancel</button>
            <button
              onClick={confirmDelete}
              disabled={busy || ((counts[deleting?.name] || 0) > 0 && !reassignTo)}
              className="btn-danger"
            >
              {busy ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }
      >
        {deleting && (
          <div className="p-6 space-y-4 text-sm text-stone-600">
            {(counts[deleting.name] || 0) > 0 ? (
              <>
                <p>
                  <span className="font-medium text-stone-900">{counts[deleting.name]} products</span> are in
                  “{deleting.name}”. Move them to:
                </p>
                <select value={reassignTo} onChange={e => setReassignTo(e.target.value)} className="input">
                  <option value="">Choose a category</option>
                  {categories.filter(c => c.id !== deleting.id).map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </>
            ) : (
              <p>Delete <span className="font-medium text-stone-900">{deleting.name}</span>? No products use it.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
