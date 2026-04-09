import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone } from 'lucide-react'

const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)
import KenteDivider from '../ui/KenteDivider'

export default function Footer() {
  return (
    <footer className="bg-[#3B1F0A] text-white/70">
      <KenteDivider height={8} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-3xl font-black text-white tracking-tight block mb-4">
              Geoli<span className="text-[#F5A200]">crafts</span>
            </Link>
            <p className="text-white/55 leading-relaxed max-w-sm text-sm mb-6">
              Crafting Ghana's future through authentic African arts, traditional handcraft, and community empowerment.
              Every piece carries the soul of a culture — woven, carved, and drummed into existence.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/Geolicrafts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C1440E] flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <IconFacebook />
              </a>
              <a
                href="https://www.instagram.com/geolicrafts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C1440E] flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Our Collections' },
                { to: '/blog', label: 'Blog & News' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/50 hover:text-[#F5A200] transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/55">
                <MapPin size={15} className="text-[#F5A200] shrink-0 mt-0.5" />
                <span>Dodowa, Greater Accra<br />Ghana</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/55">
                <Phone size={15} className="text-[#F5A200] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a href="tel:+233289553203" className="block hover:text-[#F5A200] transition-colors">+233 289 553 203</a>
                  <a href="tel:+233244099243" className="block hover:text-[#F5A200] transition-colors">+233 244 099 243</a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/55">
                <Mail size={15} className="text-[#F5A200] shrink-0" />
                <a href="mailto:info@geolicraftsgh.com" className="hover:text-[#F5A200] transition-colors">
                  info@geolicraftsgh.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Geolicrafts Company Limited. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Est. 2004 &middot; Dodowa, Ghana
          </p>
        </div>
      </div>

      <KenteDivider height={5} />
    </footer>
  )
}
