/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f4d9a8',
          300: '#ecbe6e',
          400: '#e29f3a',
          500: '#d4841e',
          600: '#b86915',
          700: '#964f12',
          800: '#7a3f15',
          900: '#653514',
          950: '#3a1a08',
        },
        earth: {
          50:  '#f9f7f4',
          100: '#f0ebe3',
          200: '#dfd4c4',
          300: '#c9b79d',
          400: '#b09474',
          500: '#9c7a59',
          600: '#8a664d',
          700: '#725242',
          800: '#5e4439',
          900: '#4e3931',
          950: '#291d19',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
