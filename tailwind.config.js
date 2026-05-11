/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ghana flag / Kente gold — primary accent
        kente: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#F5A200',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
          950: '#2a0f01',
        },
        // Ghana forest green
        forest: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a',
          600: '#15803d',
          700: '#006B3F',
          800: '#004D2E',
          900: '#003320',
          950: '#001A10',
        },
        // Ghana red / Accra earth red
        accra: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#f87171',
          500: '#CE1126',
          600: '#B22222',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
          950: '#270606',
        },
        // Warm sand / earth (neutral base)
        sand: {
          50:  '#faf8f5',
          100: '#f0e9dc',
          200: '#dfd0b8',
          300: '#c9b08e',
          400: '#b08e68',
          500: '#9c744d',
          600: '#845f40',
          700: '#6b4c35',
          800: '#573e2d',
          900: '#483427',
          950: '#271a14',
        },
        // Keep brand alias pointing to kente for existing classes
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#F5A200',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
          950: '#2a0f01',
        },
        // earth alias stays for existing classes
        earth: {
          50:  '#faf8f5',
          100: '#f0e9dc',
          200: '#dfd0b8',
          300: '#c9b08e',
          400: '#b08e68',
          500: '#9c744d',
          600: '#845f40',
          700: '#6b4c35',
          800: '#573e2d',
          900: '#483427',
          950: '#271a14',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'kente-stripe': `repeating-linear-gradient(
          90deg,
          #000000 0px, #000000 3px,
          #F5A200 3px, #F5A200 16px,
          #006B3F 16px, #006B3F 28px,
          #CE1126 28px, #CE1126 31px,
          #F5A200 31px, #F5A200 44px,
          #000000 44px, #000000 47px,
          #006B3F 47px, #006B3F 56px
        )`,
        'kente-stripe-v': `repeating-linear-gradient(
          180deg,
          #000000 0px, #000000 3px,
          #F5A200 3px, #F5A200 16px,
          #006B3F 16px, #006B3F 28px,
          #CE1126 28px, #CE1126 31px,
          #F5A200 31px, #F5A200 44px,
          #000000 44px, #000000 47px
        )`,
        'adinkra-dots': `radial-gradient(circle, rgba(245,162,0,0.12) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'adinkra': '28px 28px',
      },
    },
  },
  plugins: [],
}
