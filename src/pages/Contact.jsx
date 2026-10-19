import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Mail, Phone, Check, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'

const SUBJECTS = ['Product Enquiry', 'Export / Wholesale', 'Training Programme', 'Partnership', 'General Enquiry']

const details = [
  { icon: MapPin, label: 'Office & training centre', lines: ['Dodowa, Greater Accra Region, Ghana'] },
  { icon: Phone, label: 'Phone', lines: ['+233 289 553 203', '+233 244 099 243'], href: v => `tel:${v.replace(/\s/g, '')}` },
  { icon: Mail, label: 'Email', lines: ['info@geolicraftsgh.com'], href: v => `mailto:${v}` },
]

export default function Contact() {
  const [params] = useSearchParams()
  const product = params.get('product')
  const initial = {
    name: '',
    email: '',
    subject: product ? 'Product Enquiry' : '',
    message: product ? `Hello, I'd like to know more about the "${product}".` : '',
  }
  const [form, setForm] = useState(initial)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.from('contact_messages').insert([{
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    }])

    if (error) {
      toast.error('Failed to send message. Please try again.')
    } else {
      setSubmitted(true)
      toast.success('Message sent')
    }
    setSubmitting(false)
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Let's <em className="text-clay-600">talk.</em></>}
        description="Products, wholesale, partnerships or training programmes — we usually reply within two working days."
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

            <div className="border-t border-stone-200 pt-8 space-y-6">
              <div>
                <p className="font-medium text-stone-900 mb-1.5">Export enquiries</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  We export to Europe, the USA and worldwide — bulk orders, wholesale partnerships and international trade.
                </p>
              </div>
              <div>
                <p className="font-medium text-stone-900 mb-1.5">Training programmes</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Vocational training for youth and women in the Dodowa area. Ask us about the next intake.
                </p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="card p-6 sm:p-10">
              {submitted ? (
                <div className="text-center py-16">
                  <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-clay-50 text-clay-600 mb-6">
                    <Check size={24} />
                  </span>
                  <h2 className="text-4xl text-stone-900 mb-3">Message sent.</h2>
                  <p className="text-stone-500">Thank you for reaching out — we'll be in touch soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="btn-secondary mt-8"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">Full name</label>
                      <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Ama Mensah" className="input" />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">Email</label>
                      <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" className="input" />
                    </div>
                  </div>

                  <fieldset>
                    <legend className="label">What's this about?</legend>
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
                          {s}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className="label">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us how we can help…"
                      className="input resize-none"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-stone-400">We'll only use your details to reply to you.</p>
                    <button type="submit" disabled={submitting} className="btn-primary btn-lg">
                      {submitting ? 'Sending…' : <>Send message <ArrowRight size={16} /></>}
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
