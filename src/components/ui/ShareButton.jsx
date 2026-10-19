import { Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useI18n } from '../../i18n'

// Opens the phone's share sheet (WhatsApp, Instagram, Messages…); on desktop copies the link.
export default function ShareButton({ title, text, url, className = 'btn-secondary btn-lg' }) {
  const { t } = useI18n()

  const share = async () => {
    const link = url || window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: link })
      } catch { /* closed the share sheet */ }
      return
    }
    try {
      await navigator.clipboard.writeText(link)
      toast.success(t('common.linkCopied'))
    } catch {
      window.prompt(t('common.share'), link)
    }
  }

  return (
    <button type="button" onClick={share} className={className}>
      <Share2 size={16} /> {t('common.share')}
    </button>
  )
}
