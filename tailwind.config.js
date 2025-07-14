/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e3e9f7',
          100: '#b3c7f3',
          200: '#7fa3e7',
          300: '#4d7edc',
          400: '#2563eb', // UMAIビルダー風ブルー
          500: '#1e40af',
          600: '#181e2a',
          700: '#23242a',
          800: '#18191c',
          900: '#101114',
        },
        accent: {
          orange: '#f97316',
          green: '#10b981',
          blue: '#60a5fa', // 水色
          cyan: '#38bdf8', // 明るいブルー
        },
        background: '#18191c',
        text: '#fff',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 