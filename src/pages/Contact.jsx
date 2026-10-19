import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Mail, Phone, Check, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'
import Honeypot from '../components/ui/Honeypot'
import { WhatsAppIcon } from '../components/ui/WhatsAppButton'
import { useI18n } from '../i18n'
import { submitEnquiry } from '../lib/enquiry'
import { SITE, whatsappLink } from '../lib/site'

// Stored in English so the admin inbox stays consistent; labels are translated
const SUBJECTS = ['Product Enquiry', 'Export / Wholesale', 'Training Programme', 'Partnership', 'General Enquiry']
const EMPTY = { name: '', email: '', subject: '', message: '', website: '' }

export default function Contact() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const product = params.get('product')
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    subject: product ? 'Product Enquiry' : '',
    message: product ? t('contact.productMessage', { product }) : '',
  }))
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const details = [
    { icon: MapPin, label: t('contact.office'), lines: [SITE.address] },
    { icon: Phone, label: t('contact.phone'), lines: SITE.phones, href: v => `tel:${v.replace(/\s/g, '')}` },
    { icon: Mail, label: t('contact.email'), lines: [SITE.email], href: v => `mailto:${v}` },
  ]

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await submitEnquiry({ type: 'message', ...form, elapsed: Date.now() - startedAt })
    if (error) {
      toast.error(error.message || t('contact.error'))
    } else {
      setSubmitted(true)
      toast.success(t('contact.sentToast'))
    }
    setSubmitting(false)
  }

  return (
    <>
      <PageHeader
        eyebrow={t('contact.eyebrow')}
        title={<>{t('contact.title')} <em className="text-clay-600">{t('contact.titleEm')}</em></>}
        description={t('contact.intro')}
      />

      <section className="pb-20 md:pb-28">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Info */}
          <aside className="lg:col-span-4 space-y-10">
            <ul className="space-y-7">
              {details.map(({ icon: Icon, label, lines, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-white ring-1 ring-stone-200 text-stone-700">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-500 mb-1.5">{label}</p>
                    {lines.map(line =>
                      href ? (
                        <a key={line} href={href(line)} className="block text-stone-900 hover:text-clay-700 transition-colors">{line}</a>
                      ) : (
                        <p key={line} className="text-stone-900">{line}</p>
                      )
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <a
              href={whatsappLink(t('common.whatsappGreeting'))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full"
            >
              <span className="text-[#25D366]"><WhatsAppIcon size={18} /></span> {t('contact.whatsappCta')}
            </a>

            <div className="border-t border-stone-200 pt-8 space-y-6">
              <div>
                <p className="font-medium text-stone-900 mb-1.5">{t('contact.exportTitle')}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{t('contact.exportText')}</p>
              </div>
              <div>
                <p className="font-medium text-stone-900 mb-1.5">{t('contact.trainingTitle')}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{t('contact.trainingText')}</p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="card p-6 sm:p-10 relative">
              {submitted ? (
                <div className="text-center py-16">
                  <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-clay-50 text-clay-600 mb-6">
                    <Check size={24} />
                  </span>
                  <h2 className="text-4xl text-stone-900 mb-3">{t('contact.sentTitle')}</h2>
                  <p className="text-stone-500">{t('contact.sentText')}</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(EMPTY); setStartedAt(Date.now()) }}
                    className="btn-secondary mt-8"
                  >
                    {t('contact.another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Honeypot value={form.website} onChange={handleChange} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">{t('contact.name')}</label>
                      <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required maxLength={120} autoComplete="name" className="input" />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">{t('contact.emailLabel')}</label>
                      <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required maxLength={200} autoComplete="email" placeholder="you@company.com" className="input" />
                    </div>
                  </div>

                  <fieldset>
                    <legend className="label">{t('contact.about')}</legend>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map(s => (
                        <label
                          key={s}
                          className={`cursor-pointer h-9 px-4 inline-flex items-center rounded-full text-sm transition-colors ring-1 ring-inset has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-clay-500 ${
                            form.subject === s
                              ? 'bg-stone-900 text-white ring-stone-900'
                              : 'bg-white text-stone-600 ring-stone-200 hover:ring-stone-300 hover:text-stone-900'
                          }`}
                        >
                          <input
                            type="radio"
                            name="subject"
                            value={s}
                            checked={form.subject === s}
                            onChange={handleChange}
                            required
                            className="sr-only"
                          />
                          {t(`contact.subjects.${s}`)}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className="label">{t('contact.message')}</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      maxLength={5000}
                      rows={6}
                      placeholder={t('contact.messagePlaceholder')}
                      className="input resize-none"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-stone-400">{t('contact.privacy')}</p>
                    <button type="submit" disabled={submitting} className="btn-primary btn-lg">
                      {submitting ? t('contact.sending') : <>{t('contact.send')} <ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
