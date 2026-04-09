import { useState } from 'react'
import { MapPin, Mail, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import KenteDivider from '../components/ui/KenteDivider'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
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
      toast.success('Message sent!')
    }
    setSubmitting(false)
  }

  return (
    <>
      {/* Header */}
      <section className="pt-24 pb-0 mudcloth-bg relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-16">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-4 h-1 rounded-full bg-accra-500 inline-block" />
            <span className="w-4 h-1 rounded-full bg-kente-400 inline-block" />
            <span className="w-4 h-1 rounded-full bg-forest-500 inline-block" />
          </div>
          <span className="inline-block bg-kente-400/20 text-kente-300 border border-kente-400/30 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-forest-200 text-lg max-w-2xl mx-auto">
            Interested in our products, partnerships, or training programmes? We'd love to hear from you.
          </p>
        </div>
        <KenteDivider height={10} />
      </section>

      <section className="py-24 kente-weave-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-earth-900 mb-6">Contact Information</h2>
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-kente-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-forest-700" />
                    </div>
                    <div>
                      <p className="font-medium text-earth-900 text-sm mb-0.5">Main Office & Training Centre</p>
                      <p className="text-earth-500 text-sm">Dodowa, Greater Accra Region, Ghana</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-kente-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-forest-700" />
                    </div>
                    <div>
                      <p className="font-medium text-earth-900 text-sm mb-0.5">Phone</p>
                      <p className="text-earth-500 text-sm">+233 289 553 203<br />+233 244 099 243</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-kente-100 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-forest-700" />
                    </div>
                    <div>
                      <p className="font-medium text-earth-900 text-sm mb-0.5">Email</p>
                      <a href="mailto:info@geolicraftsgh.com" className="text-forest-700 text-sm hover:underline">
                        info@geolicraftsgh.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-forest-700 rounded-2xl p-6 text-white">
                <h3 className="font-display text-lg font-semibold mb-2">Export Enquiries</h3>
                <p className="text-forest-200 text-sm leading-relaxed">
                  We export to Europe, the USA, and worldwide. Contact us for bulk orders, wholesale partnerships, or international trade enquiries.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-earth-900 mb-2">Training Programmes</h3>
                <p className="text-earth-500 text-sm leading-relaxed">
                  Interested in our vocational training? Get in touch to learn about our programmes for youth and women in the Dodowa area.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
                    <h3 className="font-display text-2xl font-bold text-earth-900 mb-2">Message Sent!</h3>
                    <p className="text-earth-500">Thank you for reaching out. We'll get back to you soon.</p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                      className="btn-primary mt-6"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-bold text-earth-900 mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-earth-700 mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-earth-700 mb-1.5">Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1.5">Subject *</label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className="input-field"
                        >
                          <option value="">Select a subject</option>
                          <option>Product Enquiry</option>
                          <option>Export / Wholesale</option>
                          <option>Training Programme</option>
                          <option>Partnership</option>
                          <option>General Enquiry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1.5">Message *</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Tell us how we can help..."
                          className="input-field resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full justify-center"
                      >
                        {submitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
