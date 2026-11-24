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
          blue: '#1769AA',
          'blue-hover': '#12568C',
          'blue-light': '#EBF4FC',
          navy: '#102A43',
          'navy-dark': '#0A1C2E',
          green: '#16A36A',
          'green-hover': '#128354',
          'green-light': '#E6F6EF',
          bg: '#F4F7FB',
          card: '#FFFFFF',
          text: '#263445',
          muted: '#627D98',
          border: '#D9E2EC',
          amber: '#F59E0B',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(16, 42, 67, 0.08), 0 1px 4px -1px rgba(16, 42, 67, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(16, 42, 67, 0.12), 0 4px 10px -2px rgba(16, 42, 67, 0.06)',
        'dropdown': '0 10px 30px -5px rgba(16, 42, 67, 0.15), 0 4px 8px -2px rgba(16, 42, 67, 0.05)',
      }
    },
  },
  plugins: [],
}
