import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, BookOpen, MessageSquare,
  LogOut, Menu, X, ChevronRight, ExternalLink, Upload
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/import', icon: Upload, label: 'Bulk Import' },
  { to: '/admin/blog', icon: BookOpen, label: 'Blog Posts' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-earth-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-earth-950/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-earth-950 z-50 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-earth-800">
          <Link to="/" className="font-display text-lg font-bold text-white">
            Geoli<span className="text-brand-400">crafts</span>
          </Link>
          <button
            className="md:hidden text-earth-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-earth-400 hover:bg-earth-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User & signout */}
        <div className="px-3 py-4 border-t border-earth-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-earth-400 text-xs">Logged in as</p>
            <p className="text-white text-sm font-medium truncate">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 text-earth-400 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-earth-800 transition-colors"
            >
              <ExternalLink size={14} /> View Site
            </a>
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 text-earth-400 hover:text-red-400 text-xs px-3 py-2 rounded-lg hover:bg-earth-800 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-earth-100 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            className="md:hidden text-earth-500 hover:text-earth-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-1 text-xs text-earth-400">
            <span>Admin</span>
            <ChevronRight size={12} />
            <span className="text-earth-700 font-medium capitalize">
              {window.location.pathname.split('/').pop() || 'Dashboard'}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
