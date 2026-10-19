// submit-enquiry — validates contact/quote submissions, stores them and emails the team.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   API key from https://resend.com (optional — without it, no email is sent)
//   NOTIFY_EMAIL     where notifications go, e.g. info@geolicraftsgh.com
//   RESEND_FROM      optional sender, e.g. "Geolicrafts <website@geolicraftsgh.com>"
//                    (needs a verified domain in Resend; defaults to onboarding@resend.dev)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.

import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const MIN_FILL_MS = 3000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const escape = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

type Item = { id: string; name: string; qty: number; notes: string }

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  // ── Spam checks: honeypot, fill time, link stuffing ──
  // Bots get a fake success so they don't learn what tripped them.
  if (str(body.website, 200)) return json({ ok: true })
  if (typeof body.elapsed === 'number' && body.elapsed < MIN_FILL_MS) return json({ ok: true })

  const type = body.type === 'quote' ? 'quote' : 'message'
  const name = str(body.name, 120)
  const email = str(body.email, 200)
  const subject = str(body.subject, 120) || (type === 'quote' ? 'Quote Request' : 'General Enquiry')
  const message = str(body.message, 5000)
  const company = str(body.company, 160)
  const country = str(body.country, 100)
  const phone = str(body.phone, 60)

  const items: Item[] = Array.isArray(body.items)
    ? body.items.slice(0, 100).map((i: Record<string, unknown>) => ({
        id: str(String(i?.id ?? ''), 64),
        name: str(i?.name, 200),
        qty: Math.min(Math.max(Math.floor(Number(i?.qty) || 1), 1), 100000),
        notes: str(i?.notes, 300),
      })).filter(i => i.name)
    : []

  if (!name || !EMAIL_RE.test(email)) return json({ error: 'Please enter your name and a valid email.' }, 400)
  if (type === 'message' && message.length < 2) return json({ error: 'Please enter a message.' }, 400)
  if (type === 'quote' && items.length === 0) return json({ error: 'Your quote list is empty.' }, 400)
  if ((message.match(/https?:\/\//gi) || []).length > 3) return json({ error: 'Too many links in your message.' }, 400)

  // ── Store ──
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { error } = await supabase.from('contact_messages').insert([{
    type, name, email, subject,
    message: message || '(no message)',
    company: company || null,
    country: country || null,
    phone: phone || null,
    items: items.length ? items : null,
  }])
  if (error) {
    console.error('insert failed', error)
    return json({ error: 'Could not save your message.' }, 500)
  }

  // ── Notify ──
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const to = Deno.env.get('NOTIFY_EMAIL')
  if (apiKey && to) {
    const rows = [
      ['Name', name], ['Email', email], ['Company', company], ['Country', country], ['Phone', phone],
    ].filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#78716c">${k}</td><td>${escape(v)}</td></tr>`)
      .join('')
    const itemRows = items
      .map(i => `<tr><td style="padding:4px 16px 4px 0">${i.qty} ×</td><td>${escape(i.name)}${i.notes ? ` <span style="color:#78716c">(${escape(i.notes)})</span>` : ''}</td></tr>`)
      .join('')

    const html = `
      <div style="font-family:system-ui,sans-serif;font-size:14px;color:#1c1917">
        <h2 style="font-weight:600;margin:0 0 16px">${type === 'quote' ? 'New quote request' : 'New message'}: ${escape(subject)}</h2>
        <table>${rows}</table>
        ${items.length ? `<h3 style="margin:24px 0 8px">Items</h3><table>${itemRows}</table>` : ''}
        ${message ? `<h3 style="margin:24px 0 8px">Message</h3><p style="white-space:pre-wrap;margin:0">${escape(message)}</p>` : ''}
      </div>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: Deno.env.get('RESEND_FROM') || 'Geolicrafts Website <onboarding@resend.dev>',
        to: to.split(',').map(s => s.trim()),
        reply_to: email,
        subject: `${type === 'quote' ? '[Quote]' : '[Website]'} ${subject} — ${name}`,
        html,
      }),
    })
    // The enquiry is already saved, so a failed email is logged rather than shown to the visitor
    if (!res.ok) console.error('resend failed', res.status, await res.text())
  }

  return json({ ok: true })
})
