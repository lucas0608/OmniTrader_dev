/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff9933',
        background: '#1a1a1a',
      },
      fontFamily: {
        mono: ['Lucida Console', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}