import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white shadow-md'

  const textColor = isHome && !scrolled
    ? 'text-white'
    : 'text-earth-800'

  const logoColor = isHome && !scrolled
    ? 'text-white'
    : 'text-brand-600'

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className={`font-display text-xl font-bold ${logoColor} transition-colors duration-300`}>
            Geoli<span className="text-brand-400">crafts</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-500 font-semibold'
                      : `${textColor} hover:text-brand-400`
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-2 rounded-lg ${textColor}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-earth-100 shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-earth-700 hover:bg-earth-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
