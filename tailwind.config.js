// tailwind.config.js

const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f1faee',
        foreground: '#1d3557',
        primary: '#457b9d',
        secondary: '#a8dadc',
        accent: '#e63946',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', ...fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};