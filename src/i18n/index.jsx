import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import en from './en'
import de from './de'
import it from './it'
import { LANGUAGES } from './languages'

const DICTS = { en, de, it }
const STORAGE_KEY = 'geolicrafts-lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (DICTS[saved]) return saved
  } catch { /* storage unavailable */ }
  const nav = (navigator.language || 'en').slice(0, 2)
  return DICTS[nav] ? nav : 'en'
}

const lookup = (dict, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict)

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback(code => {
    setLangState(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch { /* storage unavailable */ }
  }, [])

  // t('home.hero.title') — falls back to English, then to the key itself.
  // {name} placeholders are filled from vars.
  const t = useCallback((key, vars) => {
    let value = lookup(DICTS[lang], key)
    if (value === undefined) value = lookup(en, key)
    if (value === undefined) return key
    if (typeof value === 'string' && vars) {
      value = value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
    }
    return value
  }, [lang])

  const locale = LANGUAGES.find(l => l.code === lang).locale
  const formatDate = useCallback(
    (d, opts = { day: 'numeric', month: 'long', year: 'numeric' }) => new Date(d).toLocaleDateString(locale, opts),
    [locale]
  )
  // Product categories are stored in English in the database
  const tc = useCallback(cat => lookup(DICTS[lang], 'categories')?.[cat] || cat, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tc, formatDate }}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext)
