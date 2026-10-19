import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, BookOpen, MessageSquare, Inbox, ArrowUpRight, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import AdminHeader from '../../components/ui/AdminHeader'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ products: 0, posts: 0, messages: 0, unread: 0 })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [products, posts, messages, unread, recent] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        products: products.count || 0,
        posts: posts.count || 0,
        messages: messages.count || 0,
        unread: unread.count || 0,
      })
      setRecentMessages(recent.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Products', value: stats.products, icon: Package, to: '/admin/products' },
    { label: 'Blog posts', value: stats.posts, icon: BookOpen, to: '/admin/blog' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, to: '/admin/messages' },
    { label: 'Unread', value: stats.unread, icon: Inbox, to: '/admin/messages', accent: true },
  ]

  const name = user?.email?.split('@')[0]

  return (
    <div>
      <AdminHeader title={`${greeting()}${name ? `, ${name}` : ''}.`} description="Here's what's happening at Geolicrafts.">
        <Link to="/admin/blog" className="btn-secondary btn-sm"><Plus size={14} /> New post</Link>
        <Link to="/admin/products" className="btn-primary btn-sm"><Plus size={14} /> New product</Link>
      </AdminHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, to, accent }) => (
          <Link key={label} to={to} className="group card p-5 hover:ring-stone-300 transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <span className={`grid place-items-center h-9 w-9 rounded-full ${accent && value > 0 ? 'bg-clay-50 text-clay-600' : 'bg-stone-100 text-stone-600'}`}>
                <Icon size={16} />
              </span>
              <ArrowUpRight size={16} className="text-stone-300 group-hover:text-stone-900 transition-colors" />
            </div>
            {loading
              ? <div className="h-9 w-14 bg-stone-100 animate-pulse rounded-lg" />
              : <p className="font-display text-5xl leading-none text-stone-900 tabular-nums">{value}</p>}
            <p className="text-sm text-stone-500 mt-2">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 h-14 border-b border-stone-100">
          <h2 className="font-sans text-sm font-semibold tracking-normal text-stone-900">Recent messages</h2>
          <Link to="/admin/messages" className="btn-ghost btn-sm -mr-3">View all</Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-stone-50 animate-pulse rounded-xl" />)}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="py-16 text-center">
            <Inbox size={28} className="mx-auto text-stone-300 mb-3" />
            <p className="text-sm text-stone-500">No messages yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {recentMessages.map(msg => (
              <li key={msg.id}>
                <Link to="/admin/messages" className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-stone-50 transition-colors">
                  <span className="grid place-items-center h-9 w-9 shrink-0 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold uppercase">
                    {msg.name?.[0] || '?'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${msg.read ? 'text-stone-700' : 'font-semibold text-stone-900'}`}>{msg.name}</span>
                      {!msg.read && <span className="h-1.5 w-1.5 rounded-full bg-clay-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5">{msg.subject} — {msg.message}</p>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0 tabular-nums">
                    {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
