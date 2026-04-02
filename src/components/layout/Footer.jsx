import { Link } from 'react-router-dom'
import { MapPin, Mail } from 'lucide-react'
import KenteDivider from '../ui/KenteDivider'
import { Adinkrahene } from '../ui/AdinkraSymbol'

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-200">
      {/* Top kente stripe */}
      <KenteDivider height={10} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                <span className="w-2 h-7 rounded-sm bg-accra-500 inline-block" />
                <span className="w-2 h-7 rounded-sm bg-kente-400 inline-block" />
                <span className="w-2 h-7 rounded-sm bg-forest-500 inline-block" />
              </div>
              <Link to="/" className="font-display text-2xl font-bold text-white">
                Geoli<span className="text-kente-400">crafts</span>
              </Link>
            </div>
            <p className="text-forest-400 leading-relaxed max-w-sm text-sm mb-6">
              Crafting Ghana's future through authentic African arts, traditional handcraft, and skills empowerment.
              Every piece carries the soul of a culture — woven, carved, and drummed into existence.
            </p>

            {/* Adinkra watermark + social */}
            <div className="flex items-center gap-4">
              <div className="opacity-30">
                <Adinkrahene size={36} color="#F5A200" />
              </div>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/Geolicrafts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-forest-800 hover:bg-kente-500 hover:text-sand-950 flex items-center justify-center transition-all text-xs font-bold text-white"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-forest-800 hover:bg-kente-500 hover:text-sand-950 flex items-center justify-center transition-all text-xs font-bold text-white"
                  aria-label="Instagram"
                >
                  ig
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-kente-400 inline-block" />
              Quick Links
            </h3>
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
                    className="text-forest-400 hover:text-kente-400 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-kente-400 inline-block" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-forest-400">
                <MapPin size={16} className="text-kente-400 shrink-0 mt-0.5" />
                <span>
                  Burman Camp, Accra, Ghana<br />
                  <span className="text-forest-500 text-xs">Training Centre: Dodowa, Ghana</span>
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-forest-400">
                <Mail size={16} className="text-kente-400 shrink-0" />
                <a href="mailto:info@geolicrafts.com" className="hover:text-kente-400 transition-colors">
                  info@geolicrafts.com
                </a>
              </li>
            </ul>

            {/* Ghana flag colours */}
            <div className="mt-6 flex gap-1">
              <span className="flex-1 h-1.5 rounded-full bg-accra-600" />
              <span className="flex-1 h-1.5 rounded-full bg-kente-400" />
              <span className="flex-1 h-1.5 rounded-full bg-forest-600" />
            </div>
            <p className="text-forest-600 text-xs mt-2">Proudly Ghanaian 🇬🇭</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-forest-500 text-sm">
            &copy; {new Date().getFullYear()} Geolicrafts Company Limited. All rights reserved.
          </p>
          <p className="text-forest-600 text-xs">
            Est. 2004 &middot; Accra, Ghana &middot; <span className="text-kente-600">Onipa na ɔhyira onipa</span>
          </p>
        </div>
      </div>

      {/* Bottom kente stripe */}
      <KenteDivider height={6} />
    </footer>
  )
}
