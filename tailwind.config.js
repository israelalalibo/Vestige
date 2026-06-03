/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-cormorant)', 'serif'],
      },
      colors: {
        vestige: {
          black: '#0a0a0a',
          white: '#fafafa',
          gray: '#6b7280',
          accent: '#c8a96e',
        },
      },
    },
  },
  plugins: [],
};
