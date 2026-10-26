/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terracotta clay is the main accent; ochre and forest add warmth. Neutrals use `stone`.
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
        ochre: {
          50:  '#fdf8ec',
          100: '#f9edcc',
          200: '#f2d994',
          300: '#eac15c',
          400: '#e3a935',
          500: '#d18c1f',
          600: '#b46c17',
          700: '#8f5017',
        },
        forest: {
          50:  '#f1f6f2',
          100: '#dceadf',
          300: '#8fb89a',
          600: '#2f6b45',
          700: '#255638',
          800: '#1f452f',
          900: '#1a3a28',
          950: '#0d2015',
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
