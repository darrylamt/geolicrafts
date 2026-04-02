import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, BookOpen, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
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
    { label: 'Products', value: stats.products, icon: Package, to: '/admin/products', color: 'bg-brand-500' },
    { label: 'Blog Posts', value: stats.posts, icon: BookOpen, to: '/admin/blog', color: 'bg-earth-600' },
    { label: 'Total Messages', value: stats.messages, icon: MessageSquare, to: '/admin/messages', color: 'bg-green-600' },
    { label: 'Unread Messages', value: stats.unread, icon: TrendingUp, to: '/admin/messages', color: 'bg-amber-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-earth-900">Dashboard</h1>
        <p className="text-earth-500 text-sm mt-1">Welcome to the Geolicrafts admin panel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link key={label} to={to} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-earth-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                <Icon size={18} className="text-white" />
              </div>
              <ArrowRight size={16} className="text-earth-300" />
            </div>
            <div className="font-display text-3xl font-bold text-earth-900">
              {loading ? <div className="h-8 w-16 bg-earth-100 animate-pulse rounded" /> : value}
            </div>
            <p className="text-earth-500 text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100">
          <h2 className="font-display font-semibold text-earth-900">Recent Messages</h2>
          <Link to="/admin/messages" className="text-brand-600 text-sm hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-earth-50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="p-8 text-center text-earth-400 text-sm">No messages yet.</div>
        ) : (
          <div className="divide-y divide-earth-50">
            {recentMessages.map(msg => (
              <div key={msg.id} className="px-6 py-4 flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${msg.read ? 'bg-earth-200' : 'bg-brand-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-earth-900 text-sm">{msg.name}</span>
                    <span className="text-earth-400 text-xs shrink-0">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-earth-500 text-xs mt-0.5">{msg.subject}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
