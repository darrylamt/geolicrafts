import { useI18n } from '../../i18n'
import { LANGUAGES } from '../../i18n/languages'

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t('nav.language')} className={`inline-flex p-0.5 rounded-full bg-stone-900/[0.05] ${className}`}>
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.name}
          lang={l.code}
          className={`h-7 px-2.5 rounded-full text-[11px] font-semibold tracking-wide transition-all ${
            lang === l.code ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
