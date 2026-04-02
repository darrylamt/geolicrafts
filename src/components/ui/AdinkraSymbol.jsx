/**
 * Adinkra symbols from the Akan people of Ghana.
 * Used as decorative cultural accents throughout the site.
 */

// Gye Nyame — "Except God" — the most popular Adinkra symbol,
// representing the supremacy and omnipotence of God.
function GyeNyame({ size = 48, color = 'currentColor', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity} aria-label="Gye Nyame — Except God">
      <ellipse cx="50" cy="50" rx="28" ry="18" stroke={color} strokeWidth="4" fill="none"/>
      <ellipse cx="50" cy="50" rx="18" ry="28" stroke={color} strokeWidth="4" fill="none"/>
      <circle cx="50" cy="50" r="7" fill={color}/>
      <line x1="50" y1="12" x2="50" y2="22" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <line x1="50" y1="78" x2="50" y2="88" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <line x1="12" y1="50" x2="22" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <line x1="78" y1="50" x2="88" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

// Sankofa — "Go back and fetch it" — learn from the past.
// A bird looking backward, representing the importance of history.
function Sankofa({ size = 48, color = 'currentColor', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity} aria-label="Sankofa — Go back and fetch it">
      <path d="M50 80 C30 80 15 65 15 50 C15 35 30 20 50 20 C70 20 85 35 85 50 C85 65 70 80 50 80Z" stroke={color} strokeWidth="4" fill="none"/>
      <path d="M50 50 C40 50 35 42 40 36 C45 30 55 30 60 36 C65 42 60 50 50 50Z" fill={color}/>
      <circle cx="50" cy="50" r="5" fill="none" stroke={color} strokeWidth="3"/>
      <path d="M35 72 L30 82 L40 78Z" fill={color}/>
      <path d="M65 72 L70 82 L60 78Z" fill={color}/>
    </svg>
  )
}

// Adinkrahene — "Chief of Adinkra symbols" — greatness, leadership, charisma.
function Adinkrahene({ size = 48, color = 'currentColor', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity} aria-label="Adinkrahene — Greatness and Leadership">
      <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="4" fill="none"/>
      <circle cx="50" cy="50" r="26" stroke={color} strokeWidth="4" fill="none"/>
      <circle cx="50" cy="50" r="13" stroke={color} strokeWidth="4" fill="none"/>
      <circle cx="50" cy="50" r="4" fill={color}/>
    </svg>
  )
}

// Dwennimmen — "Ram's horns" — humility and strength.
function Dwennimmen({ size = 48, color = 'currentColor', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity} aria-label="Dwennimmen — Humility and Strength">
      <path d="M50 50 C50 50 25 30 20 15 C15 5 30 0 35 10 C40 20 50 50 50 50Z" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M50 50 C50 50 75 30 80 15 C85 5 70 0 65 10 C60 20 50 50 50 50Z" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M50 50 C50 50 25 70 20 85 C15 95 30 100 35 90 C40 80 50 50 50 50Z" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M50 50 C50 50 75 70 80 85 C85 95 70 100 65 90 C60 80 50 50 50 50Z" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="5" fill={color}/>
    </svg>
  )
}

const symbols = { GyeNyame, Sankofa, Adinkrahene, Dwennimmen }

export { GyeNyame, Sankofa, Adinkrahene, Dwennimmen }

export default function AdinkraSymbol({ symbol = 'Adinkrahene', ...props }) {
  const Component = symbols[symbol] || Adinkrahene
  return <Component {...props} />
}
