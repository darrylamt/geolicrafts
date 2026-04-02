import { Link } from 'react-router-dom'
import { MapPin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-earth-950 text-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-2xl font-bold text-white">
              Geoli<span className="text-brand-400">crafts</span>
            </Link>
            <p className="mt-4 text-earth-400 leading-relaxed max-w-sm">
              Crafting Ghana's future through authentic African arts, traditional handcraft, and skills empowerment.
              Every piece tells a story of culture, community, and craftsmanship.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.facebook.com/Geolicrafts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-earth-800 hover:bg-brand-600 flex items-center justify-center transition-colors text-sm font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-earth-800 hover:bg-brand-600 flex items-center justify-center transition-colors text-sm font-bold"
                aria-label="Instagram"
              >
                ig
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Our Products' },
                { to: '/blog', label: 'Blog & News' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-earth-400 hover:text-brand-400 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-earth-400">
                <MapPin size={16} className="text-brand-400 shrink-0 mt-0.5" />
                <span>Burman Camp, Accra, Ghana<br />Training Centre: Dodowa, Ghana</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-earth-400">
                <Mail size={16} className="text-brand-400 shrink-0" />
                <a href="mailto:info@geolicrafts.com" className="hover:text-brand-400 transition-colors">
                  info@geolicrafts.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-earth-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-earth-500 text-sm">
            &copy; {new Date().getFullYear()} Geolicrafts Company Limited. All rights reserved.
          </p>
          <p className="text-earth-600 text-xs">
            Est. 2004 &middot; Accra, Ghana
          </p>
        </div>
      </div>
    </footer>
  )
}
