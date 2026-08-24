/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        city: {
          bg: '#0F172A',
          card: 'rgba(30, 41, 59, 0.75)',
          border: 'rgba(255, 255, 255, 0.1)',
          easy: '#10B981',
          medium: '#F59E0B',
          hard: '#EF4444',
          accent: '#3B82F6'
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
