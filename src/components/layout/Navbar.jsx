import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight, ClipboardList } from 'lucide-react'
import Logo from '../ui/Logo'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import { useI18n } from '../../i18n'
import { useQuote } from '../../context/QuoteContext'
import { SITE } from '../../lib/site'

const links = [
  { to: '/products', key: 'nav.collections' },
  { to: '/about', key: 'nav.about' },
  { to: '/blog', key: 'nav.journal' },
  { to: '/contact', key: 'nav.contact' },
]

function QuoteButton() {
  const { count, setDrawerOpen } = useQuote()
  const { t } = useI18n()
  return (
    <button
      onClick={() => setDrawerOpen(true)}
      className="relative icon-btn"
      aria-label={`${t('nav.quoteList')} (${count})`}
      title={t('nav.quoteList')}
    >
      <ClipboardList size={19} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-clay-600 text-white text-[10px] font-semibold tabular-nums animate-fade-in">
          {count}
        </span>
      )}
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { t } = useI18n()
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

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {links.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm transition-colors ${
                  isActive ? 'text-stone-900 font-medium bg-stone-900/[0.05]' : 'text-stone-500 hover:text-stone-900'
                }`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher className="hidden lg:inline-flex mr-1" />
          <QuoteButton />
          <Link to="/contact" className="btn-primary btn-sm hidden lg:inline-flex ml-1">
            {t('nav.enquire')} <ArrowUpRight size={14} />
          </Link>
          <button
            className="icon-btn lg:hidden -mr-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden h-[calc(100dvh-4rem)] overflow-y-auto bg-stone-50 animate-fade-in">
          <nav className="container-page flex flex-col pt-6 pb-10" aria-label="Mobile">
            {links.map(({ to, key }, i) => (
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
                {t(key)}
                <ArrowUpRight size={20} className="text-stone-300" />
              </NavLink>
            ))}
            <Link to="/contact" className="btn-primary btn-lg mt-8">
              {t('nav.makeEnquiry')}
            </Link>
            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-sm text-stone-500">{SITE.email}</p>
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
