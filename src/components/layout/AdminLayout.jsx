import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, BookOpen, MessageSquare,
  LogOut, Menu, X, ArrowUpRight, Upload
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import Logo from '../ui/Logo'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/import', icon: Upload, label: 'Bulk import' },
  { to: '/admin/blog', icon: BookOpen, label: 'Blog posts' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
]

export default function AdminLayout({ children }) {
  const [openPath, setOpenPath] = useState(null)
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // Sidebar is tied to the path it was opened on, so navigating closes it
  const sidebarOpen = openPath === pathname
  const setSidebarOpen = next => setOpenPath(next ? pathname : null)


  const current = navItems.find(n => (n.end ? pathname === n.to : pathname.startsWith(n.to)))

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-stone-950/30 backdrop-blur-[2px] md:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white border-r border-stone-200 z-50 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-5">
          <Logo />
          <button className="icon-btn md:hidden -mr-2" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">Manage</p>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 h-10 px-3 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-stone-100 text-stone-900 font-medium'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-stone-100 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 h-10 px-3 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            <ArrowUpRight size={17} strokeWidth={1.75} /> View site
          </a>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} strokeWidth={1.75} /> Sign out
          </button>
          <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t border-stone-100">
            <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-clay-100 text-clay-700 text-xs font-semibold uppercase">
              {user?.email?.[0] || 'A'}
            </span>
            <p className="text-xs text-stone-600 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 h-14 bg-white/85 backdrop-blur-xl border-b border-stone-200 px-4 flex items-center gap-3">
          <button className="icon-btn -ml-2" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium text-stone-900">{current?.label || 'Admin'}</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
