import { supabase } from './supabase'

// Minimum time a human needs to fill a form; faster submissions are treated as bots.
export const MIN_FILL_MS = 3000

function itemsAsText(items) {
  if (!items?.length) return ''
  return '\n\n— Quote list —\n' + items
    .map(i => `• ${i.qty} × ${i.name}${i.notes ? ` (${i.notes})` : ''}`)
    .join('\n')
}

/**
 * Sends a contact message or quote request through the `submit-enquiry`
 * Edge Function (spam checks + email notification). If the function hasn't
 * been deployed yet, falls back to a direct insert of the core fields.
 *
 * payload: { type, name, email, subject, message, company?, country?, phone?, items?, website, elapsed }
 */
export async function submitEnquiry(payload) {
  // Honeypot filled or submitted too fast: pretend success, store nothing
  if (payload.website || payload.elapsed < MIN_FILL_MS) return { error: null }

  const { error } = await supabase.functions.invoke('submit-enquiry', { body: payload })
  if (!error) return { error: null }

  const status = error.context?.status
  const notDeployed = error.name === 'FunctionsFetchError' || error.name === 'FunctionsRelayError' || status === 404
  if (!notDeployed) {
    let message = error.message
    try { message = (await error.context.json()).error || message } catch { /* not JSON */ }
    return { error: { message } }
  }

  const extras = [
    payload.company && `Company: ${payload.company}`,
    payload.country && `Country: ${payload.country}`,
    payload.phone && `Phone: ${payload.phone}`,
  ].filter(Boolean).join('\n')

  const { error: insertError } = await supabase.from('contact_messages').insert([{
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: [payload.message, extras].filter(Boolean).join('\n\n') + itemsAsText(payload.items),
  }])
  return { error: insertError }
}
