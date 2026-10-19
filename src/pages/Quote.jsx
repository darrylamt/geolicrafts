import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Check, ArrowRight, ClipboardList } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'
import QtyStepper from '../components/ui/QtyStepper'
import Honeypot from '../components/ui/Honeypot'
import { useI18n } from '../i18n'
import Seo from '../components/ui/Seo'
import { useQuote } from '../context/QuoteContext'
import { submitEnquiry } from '../lib/enquiry'
import { onImgError } from '../lib/products'

const EMPTY = { name: '', email: '', company: '', country: '', phone: '', message: '', website: '' }

export default function Quote() {
  const { t, tc } = useI18n()
  const { items, update, remove, clear } = useQuote()
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [startedAt] = useState(() => Date.now())

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await submitEnquiry({
      type: 'quote',
      subject: 'Quote Request',
      ...form,
      items: items.map(({ id, name, qty, notes }) => ({ id, name, qty, notes })),
      elapsed: Date.now() - startedAt,
    })
    setSubmitting(false)
    if (error) {
      toast.error(error.message || t('quote.error'))
      return
    }
    clear()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-5 pt-24 pb-20">
        <span className="grid place-items-center h-14 w-14 rounded-full bg-clay-50 text-clay-600 mb-6">
          <Check size={24} />
        </span>
        <h1 className="text-5xl md:text-6xl text-stone-900 mb-4">{t('quote.successTitle')}</h1>
        <p className="text-stone-500 text-lg mb-10 max-w-md">{t('quote.successText')}</p>
        <Link to="/products" className="btn-primary">{t('quote.continue')}</Link>
      </div>
    )
  }

  return (
    <>
      <Seo title={t('quote.pageEyebrow')} description={t('quote.pageIntro')} />
      <PageHeader
        eyebrow={t('quote.pageEyebrow')}
        title={<>{t('quote.pageTitle')} <em className="text-clay-600">{t('quote.pageTitleEm')}</em></>}
        description={t('quote.pageIntro')}
      />

      <section className="pb-14 md:pb-28">
        <div className="container-page">
          {items.length === 0 ? (
            <div className="card py-20 px-6 text-center">
              <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-stone-100 text-stone-400 mb-6">
                <ClipboardList size={22} />
              </span>
              <p className="font-display text-4xl text-stone-900 mb-3">{t('quote.empty')}</p>
              <p className="text-stone-500 mb-8 max-w-sm mx-auto">{t('quote.emptyText')}</p>
              <Link to="/products" className="btn-primary">{t('quote.browse')}</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Items */}
              <div className="lg:col-span-7">
                <h2 className="font-sans text-sm font-medium tracking-normal text-stone-900 pb-4 border-b border-stone-200">
                  {t('quote.yourPieces')} <span className="text-stone-400 font-normal">· {items.length === 1 ? t('quote.item') : t('quote.items', { count: items.length })}</span>
                </h2>
                <ul className="divide-y divide-stone-200 border-b border-stone-200">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-4 sm:gap-6 py-6">
                      <Link to={item.path} className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden bg-stone-200">
                        <img src={item.image} alt="" onError={onImgError} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-stone-500">{tc(item.category)}</p>
                            <Link to={item.path} className="font-medium text-stone-900 hover:text-clay-700">{item.name}</Link>
                          </div>
                          <button type="button" onClick={() => remove(item.id)} className="icon-btn h-8 w-8 hover:!text-red-600 shrink-0" aria-label={t('common.remove')}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                          <QtyStepper value={item.qty} onChange={qty => update(item.id, { qty })} size="sm" label={t('quote.qty')} />
                          <input
                            type="text"
                            value={item.notes}
                            onChange={e => update(item.id, { notes: e.target.value })}
                            placeholder={t('quote.notes')}
                            maxLength={300}
                            className="input h-8 rounded-full text-[13px] flex-1"
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to="/products" className="btn-ghost btn-sm mt-4 -ml-3">+ {t('quote.continue')}</Link>
              </div>

              {/* Details */}
              <div className="lg:col-span-5 card p-6 sm:p-8 lg:sticky lg:top-28 space-y-5">
                <h2 className="font-sans text-sm font-medium tracking-normal text-stone-900">{t('quote.yourDetails')}</h2>
                <Honeypot value={form.website} onChange={set} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t('contact.name')} name="name" value={form.name} onChange={set} required autoComplete="name" />
                  <Field label={t('contact.emailLabel')} name="email" type="email" value={form.email} onChange={set} required autoComplete="email" />
                  <Field label={t('quote.company')} hint={t('quote.optional')} name="company" value={form.company} onChange={set} autoComplete="organization" />
                  <Field label={t('quote.country')} name="country" value={form.country} onChange={set} required autoComplete="country-name" />
                </div>
                <Field label={t('quote.phone')} hint={t('quote.optional')} name="phone" type="tel" value={form.phone} onChange={set} autoComplete="tel" />
                <div>
                  <label htmlFor="q-message" className="label">{t('quote.message')}</label>
                  <textarea
                    id="q-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={set}
                    maxLength={5000}
                    placeholder={t('quote.messagePlaceholder')}
                    className="input resize-none"
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full">
                  {submitting ? t('quote.sending') : <>{t('quote.submit')} <ArrowRight size={16} /></>}
                </button>
                <p className="text-xs text-stone-400 text-center">{t('contact.privacy')}</p>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

function Field({ label, hint, name, ...props }) {
  return (
    <div>
      <label htmlFor={`q-${name}`} className="label">
        {label} {hint && <span className="text-stone-400 font-normal">({hint})</span>}
      </label>
      <input id={`q-${name}`} name={name} maxLength={200} className="input" {...props} />
    </div>
  )
}
