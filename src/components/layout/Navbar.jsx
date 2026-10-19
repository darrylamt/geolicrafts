import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Logo from '../ui/Logo'

const links = [
  { to: '/products', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  // Menu is tied to the path it was opened on, so navigating closes it
  const [openPath, setOpenPath] = useState(null)
  const open = openPath === pathname
  const setOpen = next => setOpenPath(next ? pathname : null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-stone-50/85 backdrop-blur-xl border-b border-stone-200/70'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-page flex items-center justify-between h-16 md:h-[72px]">
        <Logo />

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm transition-colors ${
                  isActive ? 'text-stone-900 font-medium bg-stone-900/[0.05]' : 'text-stone-500 hover:text-stone-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/contact" className="btn-primary btn-sm hidden md:inline-flex">
            Enquire <ArrowUpRight size={14} />
          </Link>
          <button
            className="icon-btn md:hidden -mr-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden h-[calc(100dvh-4rem)] bg-stone-50 animate-fade-in">
          <nav className="container-page flex flex-col pt-6" aria-label="Mobile">
            {links.map(({ to, label }, i) => (
              <NavLink
                key={to}
                to={to}
                style={{ animationDelay: `${i * 40}ms` }}
                className={({ isActive }) =>
                  `animate-fade-up flex items-center justify-between py-4 border-b border-stone-200 font-display text-4xl ${
                    isActive ? 'text-stone-900' : 'text-stone-500'
                  }`
                }
              >
                {label}
                <ArrowUpRight size={20} className="text-stone-300" />
              </NavLink>
            ))}
            <Link to="/contact" className="btn-primary btn-lg mt-8">
              Make an enquiry
            </Link>
            <p className="mt-8 text-sm text-stone-500">
              Dodowa, Greater Accra · info@geolicraftsgh.com
            </p>
          </nav>
        </div>
      )}
    </header>
  )
}
