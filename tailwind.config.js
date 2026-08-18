/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#FBEEF0',
          100: '#F6DCE1',
          200: '#EDB9C2',
          300: '#E09AA7',
          400: '#D58F9A',
          500: '#C87D87',
          600: '#B2626E',
          700: '#944B57',
          800: '#773C47',
          900: '#5E323B',
        },
        thyme: {
          50: '#F2F4EE',
          100: '#E2E8D6',
          200: '#C5D0AE',
          300: '#A6B585',
          400: '#8A9A6A',
          500: '#6B7556',
          600: '#565E45',
          700: '#444A38',
          800: '#353A2E',
          900: '#2A2E25',
        },
        champagne: {
          50: '#FFF8EC',
          100: '#FBEAD6',
          200: '#F6DAB8',
          300: '#EFCB9A',
          400: '#E7BC7E',
        },
        blush: {
          100: '#F8DBE0',
          200: '#F0C4CB',
          300: '#E6A6B0',
        },
        bisque: {
          200: '#EFD9C9',
          300: '#E5BCA9',
          400: '#D9A68C',
        },
        charcoal: {
          50: '#3B3236',
          100: '#322A2D',
          200: '#262023',
          300: '#1A1718',
          400: '#151213',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 18px -6px rgba(122, 80, 88, 0.18)',
        'soft-lg': '0 12px 40px -10px rgba(122, 80, 88, 0.22)',
        'glow': '0 0 0 1px rgba(200, 125, 135, 0.25), 0 8px 30px -8px rgba(200, 125, 135, 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'shimmer': 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
