/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#C9A87C',
        accent: '#8B7355',
        bronze: '#8B7355',
        surface: {
          DEFAULT: '#FDFBF7',
          dark: '#1A1816',
        },
        cream: '#FDFBF7',
        charcoal: '#2C2C2C',
        text: {
          DEFAULT: '#2C2C2C',
          dark: '#F5F1E8',
        },
        muted: '#8E8E8E',
        'muted-dark': '#B8B4AA',
        'border-dark': '#3A3630',
        'surface-elevated': {
          DEFAULT: '#FFFFFF',
          dark: '#242118',
        },
      },
      letterSpacing: {
        editorial: '0.05em',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(44, 44, 44, 0.08)',
        elegant: '0 8px 32px rgba(44, 44, 44, 0.12)',
        editorial: '0 1px 3px rgba(44, 44, 44, 0.04), 0 1px 2px rgba(44, 44, 44, 0.06)',
        'soft-dark': '0 2px 12px rgba(0, 0, 0, 0.4)',
        'elegant-dark': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'editorial-dark': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        soft: '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(4px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
