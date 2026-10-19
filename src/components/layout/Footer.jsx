import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const nav = [
  { to: '/products', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

const social = 'grid place-items-center h-9 w-9 rounded-full ring-1 ring-white/15 text-stone-300 hover:text-white hover:ring-white/40 transition'

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="container-page pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl md:text-5xl text-white leading-[1.05] max-w-md">
              Handmade in Ghana, <em className="text-clay-300">shipped worldwide.</em>
            </h2>
            <Link to="/contact" className="btn-light mt-8">
              Start an enquiry <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-5">Explore</p>
            <ul className="space-y-3">
              {nav.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-stone-300 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-5">Visit & contact</p>
            <ul className="space-y-3 text-sm text-stone-300">
              <li>Dodowa, Greater Accra, Ghana</li>
              <li><a href="tel:+233289553203" className="hover:text-white transition-colors">+233 289 553 203</a></li>
              <li><a href="tel:+233244099243" className="hover:text-white transition-colors">+233 244 099 243</a></li>
              <li><a href="mailto:info@geolicraftsgh.com" className="hover:text-white transition-colors">info@geolicraftsgh.com</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Geolicrafts Company Limited · Est. 2004
          </p>
          <div className="flex items-center gap-2">
            <a href="https://www.facebook.com/Geolicrafts" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}>
              <IconFacebook />
            </a>
            <a href="https://www.instagram.com/geolicrafts" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}>
              <IconInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
