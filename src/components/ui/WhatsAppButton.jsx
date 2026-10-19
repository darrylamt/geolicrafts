import { whatsappLink } from '../../lib/site'
import { useI18n } from '../../i18n'

export function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.04c0-5.22 4.25-9.46 9.48-9.46a9.4 9.4 0 0 1 6.7 2.78 9.4 9.4 0 0 1 2.77 6.69c0 5.22-4.25 9.47-9.47 9.47zm8.06-17.53A11.32 11.32 0 0 0 12.04.63C5.76.63.65 5.74.65 12.02c0 2.01.52 3.97 1.52 5.7L.55 23.63l6.05-1.59a11.36 11.36 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.34-8.06z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  const { t } = useI18n()
  return (
    <a
      href={whatsappLink(t('common.whatsappGreeting'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('common.whatsapp')}
      title={t('common.whatsapp')}
      className="group fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 flex items-center gap-2 h-12 sm:h-14 pl-3.5 sm:pl-4 pr-3.5 sm:pr-4 rounded-full bg-[#25D366] text-white shadow-lg shadow-stone-950/15 hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
      <WhatsAppIcon size={24} />
      <span className="hidden sm:group-hover:inline text-sm font-medium pr-1 whitespace-nowrap">{t('common.whatsapp')}</span>
    </a>
  )
}
