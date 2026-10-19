// Builds the 1200×630 social-share card (as a satori element tree, no JSX needed).
// Used by api/og.js; kept separate so it can be rendered and checked locally.

const C = {
  bg: '#fafaf9',
  surface: '#f5f5f4',
  ink: '#1c1917',
  muted: '#78716c',
  line: '#e7e5e4',
  clay: '#a54f2b',
}

const h = (type, style, ...children) => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.flat().filter(c => c !== null && c !== false) },
})
const img = (src, style) => ({ type: 'img', props: { src, style } })

// WordPress-imported names can contain HTML entities like &#215;
export const decode = s => String(s ?? '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")

// Imported names are sometimes file slugs ("djembe-kangaba-mali-bigsize") — make them readable
export function prettyName(raw) {
  const s = decode(raw).replace(/\.(jpe?g|png|webp|gif|pdf)$/i, '').trim()
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1)
  if (/\s/.test(s) || !/[-_]/.test(s)) return cap(s)
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function titleSize(text) {
  const n = text.length
  if (n <= 16) return 92
  if (n <= 28) return 78
  if (n <= 44) return 64
  if (n <= 64) return 54
  return 46
}

const clip = (s, max) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s)

/**
 * data: { title, eyebrow, tagline, image, cta, logo, domain }
 * - image: product/cover photo URL (or data URI); omitted → brand panel
 */
export function card({ title, eyebrow, tagline, image, cta, logo, domain }) {
  const name = clip(prettyName(title || 'Geolicrafts'), 90)

  const photo = image
    ? h('div', { width: 550, height: 550, borderRadius: 32, overflow: 'hidden', backgroundColor: C.surface, flexShrink: 0 },
        img(image, { width: 550, height: 550, objectFit: 'cover' }))
    : h('div', {
        width: 550, height: 550, borderRadius: 32, flexShrink: 0, backgroundColor: C.clay,
        alignItems: 'flex-end', padding: 48,
        backgroundImage: 'linear-gradient(160deg, #bd6239 0%, #863f25 100%)',
      },
        h('div', { fontFamily: 'Serif', fontStyle: 'italic', fontSize: 72, lineHeight: 1, color: '#fff' }, 'Akwaaba.'))

  return h('div', {
    width: 1200, height: 630, backgroundColor: C.bg, padding: 40, gap: 52, fontFamily: 'Inter',
  },
    photo,
    h('div', { flexDirection: 'column', flex: 1, paddingTop: 10, paddingBottom: 6, minWidth: 0 },
      // Brand
      h('div', { alignItems: 'center', gap: 14 },
        logo ? h('div', {
          width: 46, height: 46, borderRadius: 46, backgroundColor: '#fff', border: `1px solid ${C.line}`,
          alignItems: 'center', justifyContent: 'center',
        }, img(logo, { width: 34, height: 34 })) : null,
        h('div', { fontFamily: 'Serif', fontSize: 36, color: C.ink, lineHeight: 1 }, 'Geolicrafts'),
      ),

      h('div', { flex: 1 }),

      // Copy
      eyebrow ? h('div', {
        fontSize: 19, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: C.clay, marginBottom: 18,
      }, clip(decode(eyebrow), 40)) : null,
      h('div', {
        fontFamily: 'Serif', fontSize: titleSize(name), lineHeight: 0.98, color: C.ink, letterSpacing: -1,
      }, name),
      tagline ? h('div', { fontSize: 24, color: C.muted, marginTop: 22, lineHeight: 1.35 }, clip(decode(tagline), 90)) : null,

      h('div', { flex: 1 }),

      // Footer
      h('div', { alignItems: 'center', justifyContent: 'space-between', gap: 24, borderTop: `1px solid ${C.line}`, paddingTop: 26 },
        h('div', {
          backgroundColor: C.ink, color: '#fff', fontSize: 21, fontWeight: 500,
          paddingTop: 14, paddingBottom: 14, paddingLeft: 26, paddingRight: 26, borderRadius: 999, flexShrink: 0,
        }, cta || 'Request a quote  →'),
        h('div', { fontSize: 19, fontWeight: 500, color: C.muted, flexShrink: 0 }, domain || 'geolicrafts.com'),
      ),
    ),
  )
}
