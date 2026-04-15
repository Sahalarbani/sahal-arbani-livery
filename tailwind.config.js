/**
 * @version 1.0.0
 * @changelog
 * - [15-04-2026] Setup palet warna Onyx & Deep Grey (Dark Mode).
 * - [15-04-2026] Injeksi utilitas glassmorphism ala iOS 26.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        onyx: '#0F0F0F',
        deepgrey: '#1C1C1E',
        charcoal: '#2C2C2E',
        terracotta: '#E2725B', // Aksen warna organik
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
