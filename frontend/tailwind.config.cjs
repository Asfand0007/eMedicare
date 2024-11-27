/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(50px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        popUp: {
          '0%': { opacity: 0, transform: 'scale(0.2)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out',
        'pop-up': 'popUp 0.5s ease-out',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

