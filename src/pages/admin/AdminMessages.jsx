import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

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

  const handleDelete = async id => {
    if (!confirm('Delete this message?')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) toast.error('Failed to delete')
    else {
      toast.success('Message deleted')
      if (selected?.id === id) setSelected(null)
      load()
    }
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read
    if (filter === 'read') return m.read
    return true
  })

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-earth-900">Messages</h1>
          <p className="text-earth-500 text-sm mt-1">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: 'Read' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key ? 'bg-brand-600 text-white' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 h-[65vh]">
        {/* Message list */}
        <div className={`bg-white rounded-xl shadow-sm border border-earth-100 overflow-y-auto ${selected ? 'hidden md:flex md:flex-col w-full md:w-72 lg:w-80 shrink-0' : 'flex flex-col flex-1'}`}>
          {loading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-earth-50 animate-pulse rounded-lg" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <Mail size={36} className="text-earth-300 mx-auto mb-3" />
                <p className="text-earth-400 text-sm">No messages here.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-earth-50">
              {filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left px-4 py-4 hover:bg-earth-50 transition-colors ${
                    selected?.id === msg.id ? 'bg-brand-50 border-l-2 border-brand-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-sm ${!msg.read ? 'font-semibold text-earth-900' : 'text-earth-700'}`}>
                      {msg.name}
                    </span>
                    <span className="text-earth-400 text-xs shrink-0">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-xs mb-1 ${!msg.read ? 'text-earth-700' : 'text-earth-500'}`}>
                    {msg.subject}
                  </p>
                  <p className="text-earth-400 text-xs line-clamp-1">{msg.message}</p>
                  {!msg.read && (
                    <span className="inline-block w-2 h-2 bg-brand-500 rounded-full mt-1" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        {selected ? (
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-earth-100 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100">
              <div className="flex items-center gap-3">
                <MailOpen size={18} className="text-brand-600" />
                <span className="font-semibold text-earth-900 text-sm">{selected.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="p-2 text-earth-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 text-earth-400 hover:text-earth-700 hover:bg-earth-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-earth-100">
                <div>
                  <p className="font-semibold text-earth-900">{selected.name}</p>
                  <a href={`mailto:${selected.email}`} className="text-brand-600 text-sm hover:underline">
                    {selected.email}
                  </a>
                </div>
                <p className="text-earth-400 text-sm">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <p className="text-earth-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="px-6 py-4 border-t border-earth-100">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="btn-primary text-sm"
              >
                <Mail size={15} /> Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 bg-earth-50 rounded-xl border border-dashed border-earth-200 items-center justify-center text-center p-8">
            <div>
              <Mail size={40} className="text-earth-300 mx-auto mb-3" />
              <p className="text-earth-400 text-sm">Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
