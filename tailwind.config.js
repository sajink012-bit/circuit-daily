/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d93025',
        'primary-dark': '#b71c1c',
        'primary-light': '#ffebee',
        'cd-bg': '#fafafa',
        'cd-card': '#ffffff',
        'cd-border': '#e8eaed',
        'cd-text': '#1a1a1a',
        'cd-muted': '#5f6368',
        'cd-subtle': '#9aa0a6',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}