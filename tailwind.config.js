/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Single warm accent — terracotta clay. Neutrals use Tailwind's built-in `stone`.
        clay: {
          50:  '#fbf5f1',
          100: '#f5e6dc',
          200: '#ebcab6',
          300: '#dda587',
          400: '#cd7d58',
          500: '#bd6239',
          600: '#a54f2b',
          700: '#863f25',
          800: '#6d3523',
          900: '#5a2e20',
          950: '#30150e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
}
