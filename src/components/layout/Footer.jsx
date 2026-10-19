import { Link } from 'react-router-dom'
import { ArrowUpRight, Download } from 'lucide-react'
import { useI18n } from '../../i18n'
import { SITE, whatsappLink } from '../../lib/site'
import { WhatsAppIcon } from '../ui/WhatsAppButton'

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
  { to: '/products', key: 'nav.collections' },
  { to: '/about', key: 'nav.about' },
  { to: '/blog', key: 'nav.journal' },
  { to: '/contact', key: 'nav.contact' },
]

const social = 'grid place-items-center h-9 w-9 rounded-full ring-1 ring-white/15 text-stone-300 hover:text-white hover:ring-white/40 transition'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="container-page pt-14 md:pt-20 pb-24 sm:pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 lg:gap-12 pb-12 md:pb-16 border-b border-white/10">
          <div className="col-span-2 lg:col-span-6">
            <h2 className="font-display text-3xl md:text-5xl text-white leading-[1.05] max-w-md">
              {t('footer.headline')} <em className="text-clay-300">{t('footer.headlineEm')}</em>
            </h2>
            <div className="flex flex-wrap gap-2 mt-8">
              <Link to="/contact" className="btn-light">
                {t('footer.cta')} <ArrowUpRight size={15} />
              </Link>
              <Link to="/catalogue" className="btn-outline-light">
                <Download size={15} /> {t('footer.catalogue')}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-5">{t('footer.explore')}</p>
            <ul className="space-y-3">
              {nav.map(({ to, key }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-stone-300 hover:text-white transition-colors">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-5">{t('footer.visit')}</p>
            <ul className="space-y-3 text-sm text-stone-300">
              <li>{SITE.address}</li>
              {SITE.phones.map(p => (
                <li key={p}><a href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{p}</a></li>
              ))}
              <li><a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">{SITE.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
          <div className="flex items-center gap-2">
            <a href={whatsappLink(t('common.whatsappGreeting'))} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={social}>
              <WhatsAppIcon size={16} />
            </a>
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
