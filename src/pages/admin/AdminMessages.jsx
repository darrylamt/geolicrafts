import { useState, useEffect } from 'react'
import { Mail, Trash2, ArrowLeft, Reply, Inbox } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/ui/AdminHeader'
import Modal from '../../components/ui/Modal'

function shortDate(d) {
  const date = new Date(d)
  const today = new Date()
  return date.toDateString() === today.toDateString()
    ? date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openMessage = async msg => {
    setSelected(msg)
    if (!msg.read) {
      await supabase.from('contact_messages').update({ read: true }).eq('id', msg.id)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    }
  }

  const confirmDelete = async () => {
    const id = deleting.id
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) toast.error('Failed to delete')
    else {
      toast.success('Message deleted')
      if (selected?.id === id) setSelected(null)
      load()
    }
    setDeleting(null)
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read
    if (filter === 'read') return m.read
    return true
  })

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div>
      <AdminHeader title="Messages" description={`${messages.length} total · ${unreadCount} unread`} />

      <div className="card overflow-hidden flex h-[calc(100vh-15rem)] min-h-[480px]">
        {/* List */}
        <div className={`flex-col w-full md:w-80 lg:w-96 shrink-0 md:border-r border-stone-100 ${selected ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex gap-1 p-3 border-b border-stone-100">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read' },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`h-8 px-3.5 rounded-full text-[13px] inline-flex items-center gap-1.5 transition-colors ${
                  filter === key ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className={`text-[11px] tabular-nums px-1.5 rounded-full ${filter === key ? 'bg-white/20' : 'bg-clay-100 text-clay-700'}`}>{count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-3 space-y-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-stone-50 animate-pulse rounded-xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="h-full grid place-items-center p-8 text-center">
                <div>
                  <Inbox size={28} className="text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">No messages here.</p>
                </div>
              </div>
            ) : (
              <ul className="p-2 space-y-0.5">
                {filtered.map(msg => (
                  <li key={msg.id}>
                    <button
                      onClick={() => openMessage(msg)}
                      className={`w-full text-left px-3 py-3 rounded-xl transition-colors ${
                        selected?.id === msg.id ? 'bg-stone-100' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 min-w-0">
                          {!msg.read && <span className="h-1.5 w-1.5 rounded-full bg-clay-500 shrink-0" />}
                          <span className={`text-sm truncate ${!msg.read ? 'font-semibold text-stone-900' : 'text-stone-700'}`}>
                            {msg.name}
                          </span>
                        </span>
                        <span className="text-stone-400 text-xs shrink-0 tabular-nums">{shortDate(msg.created_at)}</span>
                      </div>
                      <p className={`text-xs mt-1 truncate ${!msg.read ? 'text-stone-800' : 'text-stone-500'}`}>{msg.subject}</p>
                      <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">{msg.message}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between gap-2 px-3 sm:px-5 h-14 border-b border-stone-100">
              <button onClick={() => setSelected(null)} className="btn-ghost btn-sm md:invisible -ml-1">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex items-center gap-1">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="icon-btn" aria-label="Reply">
                  <Reply size={16} />
                </a>
                <button onClick={() => setDeleting(selected)} className="icon-btn hover:!text-red-600 hover:!bg-red-50" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-8">
              <span className="chip mb-4">{selected.subject}</span>
              <div className="flex items-start justify-between gap-4 pb-6 mb-6 border-b border-stone-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-clay-100 text-clay-700 text-sm font-semibold uppercase">
                    {selected.name?.[0] || '?'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 truncate">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-stone-500 hover:text-clay-700 truncate block">
                      {selected.email}
                    </a>
                  </div>
                </div>
                <p className="text-xs text-stone-400 shrink-0 tabular-nums">
                  {new Date(selected.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="px-5 sm:px-8 py-4 border-t border-stone-100">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary btn-sm">
                <Mail size={14} /> Reply via email
              </a>
            </div>
          </div>
        ) : (
          <div className="hidden md:grid flex-1 place-items-center text-center p-8 bg-stone-50/50">
            <div>
              <Mail size={28} className="text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 text-sm">Select a message to read</p>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete message"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="btn-ghost">Cancel</button>
            <button onClick={confirmDelete} className="btn-danger">Delete</button>
          </>
        }
      >
        <p className="p-6 text-sm text-stone-600">
          Delete the message from <span className="font-medium text-stone-900">{deleting?.name}</span>? This can't be undone.
        </p>
      </Modal>
    </div>
  )
}
