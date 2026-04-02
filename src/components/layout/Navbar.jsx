import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import KenteDivider from '../ui/KenteDivider'

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

  const isTransparent = isHome && !scrolled

  const navBg = isTransparent
    ? 'bg-transparent'
    : 'bg-forest-950 shadow-lg'

  const textColor = isTransparent ? 'text-white' : 'text-forest-100'
  const activeColor = 'text-kente-400'

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}>
      {/* Kente stripe — only visible when scrolled / not on hero */}
      {!isTransparent && <KenteDivider height={4} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <span className="w-2 h-6 rounded-sm bg-accra-500 inline-block" />
              <span className="w-2 h-6 rounded-sm bg-kente-400 inline-block" />
              <span className="w-2 h-6 rounded-sm bg-forest-600 inline-block" />
            </div>
            <span className={`font-display text-xl font-bold transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-white'}`}>
              Geoli<span className="text-kente-400">crafts</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? `${activeColor} font-semibold`
                      : `${textColor} hover:text-kente-300`
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-forest-950 border-t border-forest-800">
          {/* Kente stripe in mobile menu */}
          <KenteDivider height={5} />
          <nav className="flex flex-col px-4 py-4 gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-800 text-kente-400 font-semibold'
                      : 'text-forest-200 hover:bg-forest-800 hover:text-white'
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
