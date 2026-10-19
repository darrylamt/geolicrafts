import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Trash2, ClipboardList, ArrowRight } from 'lucide-react'
import { useQuote } from '../../context/QuoteContext'
import { useI18n } from '../../i18n'
import { onImgError } from '../../lib/products'
import QtyStepper from './QtyStepper'

export default function QuoteDrawer() {
  const { items, count, update, remove, drawerOpen, setDrawerOpen } = useQuote()
  const { t, tc } = useI18n()
  const close = () => setDrawerOpen(false)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = e => e.key === 'Escape' && setDrawerOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen, setDrawerOpen])

  if (!drawerOpen) return null

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-stone-950/30 backdrop-blur-[2px] animate-fade-in" onClick={close} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('quote.title')}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-stone-50 shadow-2xl flex flex-col animate-fade-in"
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-stone-200">
          <p className="font-medium text-stone-900">
            {t('quote.title')}
            {count > 0 && <span className="ml-2 text-stone-500 font-normal">{count === 1 ? t('quote.item') : t('quote.items', { count })}</span>}
          </p>
          <button onClick={close} className="icon-btn -mr-2" aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>

        {count === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <span className="grid place-items-center h-14 w-14 rounded-full bg-white ring-1 ring-stone-200 text-stone-400 mb-6">
              <ClipboardList size={22} />
            </span>
            <p className="font-display text-3xl text-stone-900 mb-2">{t('quote.empty')}</p>
            <p className="text-sm text-stone-500 mb-8 max-w-xs">{t('quote.emptyText')}</p>
            <Link to="/products" onClick={close} className="btn-primary">{t('quote.browse')}</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-stone-200 px-5">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 py-5">
                  <Link to={item.path} onClick={close} className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-stone-200">
                    <img src={item.image} alt="" onError={onImgError} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-xs text-stone-500">{tc(item.category)}</p>
                    <Link to={item.path} onClick={close} className="text-sm font-medium text-stone-900 hover:text-clay-700 line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <QtyStepper value={item.qty} onChange={qty => update(item.id, { qty })} size="sm" />
                      <button onClick={() => remove(item.id)} className="icon-btn h-8 w-8 hover:!text-red-600" aria-label={t('common.remove')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-5 border-t border-stone-200 space-y-2 bg-white">
              <Link to="/quote" onClick={close} className="btn-primary btn-lg w-full">
                {t('quote.request')} <ArrowRight size={16} />
              </Link>
              <button onClick={close} className="btn-ghost w-full">{t('quote.continue')}</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
