// Business details used across the site — change them here once.
export const SITE = {
  email: 'geolicrafts@yahoo.com',
  phones: ['+233 244 099 243'],
  // WhatsApp number in international format, digits only
  whatsapp: '233244099243',
  address: 'Dodowa, Greater Accra, Ghana',
}

export const whatsappLink = text =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export function slugify(str = '') {
  return str.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item'
}

// Pretty URL when the DB has a slug, otherwise name--id (works before the migration runs)
export const productPath = p => `/products/${p.slug || `${slugify(p.name)}--${p.id}`}`
