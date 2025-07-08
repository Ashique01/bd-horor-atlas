/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
         backgroundImage: {
        spooky: "url('/src/assets/spooky.jpg')",
      },
      colors: {
        cuteghost: "#d3d3e0", // light eerie gray
      },
      boxShadow: {
        cuteghost: "0 0 10px rgba(255,255,255,0.2)",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Ensure Poppins is imported in index.html
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        blob: { // New keyframes for background blobs
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.7s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'blob': 'blob 7s infinite ease-in-out', // New
      }
    },
  },
  plugins: [ require('@tailwindcss/line-clamp')],
}