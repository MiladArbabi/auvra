// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-figtree)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [aspectRatio],
};

export default config;