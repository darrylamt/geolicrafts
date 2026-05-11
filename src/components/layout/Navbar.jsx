import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const leftLinks = [
  { to: '/products', label: 'Collections' },
  { to: '/about', label: 'About' },
]

const rightLinks = [
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

const allLinks = [...leftLinks, ...rightLinks]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const isTransparent = isHome && !scrolled

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-[#F5F0E8] border-b border-[#3B1F0A]/10'}`}>

      {/* Top utility bar */}
      <div className="bg-[#3B1F0A] text-[#F5F0E8]/70 text-[11px] tracking-widest uppercase hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-1.5">
          <span>Dodowa, Greater Accra &nbsp;·&nbsp; Est. 2004 &nbsp;·&nbsp; Mon–Sat 8am–5pm</span>
          <span>+233 289 553 203 &nbsp;·&nbsp; info@geolicraftsgh.com</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative flex items-center justify-between h-16 md:h-[60px]">

          {/* Left links */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {leftLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-[11px] tracking-widest uppercase font-semibold transition-colors duration-200 ${
                    isTransparent
                      ? isActive ? 'text-white' : 'text-white/70 hover:text-white'
                      : isActive ? 'text-[#C1440E]' : 'text-[#3B1F0A]/60 hover:text-[#3B1F0A]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Centered logo */}
          <Link
            to="/"
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center px-3 py-1.5 rounded-xl transition-all duration-300 ${
              isTransparent ? 'bg-white/20 backdrop-blur-sm' : ''
            }`}
          >
            <img
              src="/logo.png"
              alt="Geolicrafts"
              className="h-9 w-auto"
            />
          </Link>

          {/* Right links */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-end">
            {rightLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-[11px] tracking-widest uppercase font-semibold transition-colors duration-200 ${
                    isTransparent
                      ? isActive ? 'text-white' : 'text-white/70 hover:text-white'
                      : isActive ? 'text-[#C1440E]' : 'text-[#3B1F0A]/60 hover:text-[#3B1F0A]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-2 ml-auto ${isTransparent ? 'text-white' : 'text-[#3B1F0A]'}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#F5F0E8] border-t border-[#3B1F0A]/10">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {allLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `py-3 text-[11px] tracking-widest uppercase font-semibold border-b border-[#3B1F0A]/10 transition-colors ${
                    isActive ? 'text-[#C1440E]' : 'text-[#3B1F0A]/70 hover:text-[#3B1F0A]'
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
