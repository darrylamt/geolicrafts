/**
 * Adinkra symbols from the Akan people of Ghana.
 * Used as decorative cultural accents throughout the site.
 */

// Gye Nyame — "Except God" — supremacy of God.
function GyeNyame({ size = 48, color = 'currentColor', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity} aria-label="Gye Nyame — Except God">
      {/* Central vertical stem */}
      <line x1="50" y1="8" x2="50" y2="92" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      {/* Top spiral curl left */}
      <path d="M50 8 C50 8 36 8 30 16 C24 24 30 34 38 30 C46 26 44 16 50 14" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Top spiral curl right */}
      <path d="M50 8 C50 8 64 8 70 16 C76 24 70 34 62 30 C54 26 56 16 50 14" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Bottom spiral curl left */}
      <path d="M50 92 C50 92 36 92 30 84 C24 76 30 66 38 70 C46 74 44 84 50 86" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Bottom spiral curl right */}
      <path d="M50 92 C50 92 64 92 70 84 C76 76 70 66 62 70 C54 74 56 84 50 86" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Left arm */}
      <path d="M50 50 C50 50 20 42 10 50 C20 58 50 50 50 50" stroke={color} strokeWidth="3.5" fill={color} strokeLinecap="round"/>
      {/* Right arm */}
      <path d="M50 50 C50 50 80 42 90 50 C80 58 50 50 50 50" stroke={color} strokeWidth="3.5" fill={color} strokeLinecap="round"/>
      {/* Center dot */}
      <circle cx="50" cy="50" r="4" fill={color}/>
    </svg>
  )
}

// Sankofa — "Go back and fetch it" — learn from the past.
// Heart/spiral variant as shown in the image.
function Sankofa({ size = 48, color = 'currentColor', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity} aria-label="Sankofa — Go back and fetch it">
      {/* Left lobe of heart */}
      <path d="M50 75 C50 75 12 55 12 32 C12 18 22 10 33 14 C40 17 46 24 50 30" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Right lobe of heart */}
      <path d="M50 75 C50 75 88 55 88 32 C88 18 78 10 67 14 C60 17 54 24 50 30" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Top spiral on left lobe */}
      <path d="M33 14 C28 8 20 10 20 18 C20 24 27 26 32 22 C37 18 35 12 30 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Top spiral on right lobe */}
      <path d="M67 14 C72 8 80 10 80 18 C80 24 73 26 68 22 C63 18 65 12 70 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Stem going down */}
      <line x1="50" y1="75" x2="50" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      {/* Bottom decorative foot */}
      <path d="M42 90 Q50 95 58 90" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
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
// Four spiral horns arranged symmetrically from center.
function Dwennimmen({ size = 48, color = 'currentColor', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity} aria-label="Dwennimmen — Humility and Strength">
      {/* Top-left horn — curls outward then back */}
      <path d="M50 50 C50 44 44 38 36 36 C28 34 22 38 22 44 C22 50 28 54 34 52 C40 50 42 44 38 40" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Top-right horn */}
      <path d="M50 50 C56 44 62 38 70 36 C78 34 84 38 84 44 C84 50 78 54 72 52 C66 50 64 44 68 40" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Bottom-left horn */}
      <path d="M50 50 C44 56 38 62 36 70 C34 78 38 84 44 84 C50 84 54 78 52 72 C50 66 44 64 40 68" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Bottom-right horn */}
      <path d="M50 50 C56 56 62 62 70 64 C78 66 84 62 84 56 C84 50 78 46 72 48 C66 50 64 56 68 60" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Center */}
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
