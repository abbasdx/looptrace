/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#166534',    // Dark Green
        accent: '#10B981',     // Light Green
        background: '#F8FAF7', // Off-white/Greenish background
        surface: '#EAF3EB',    // Light green surface for cards
        textMain: '#17211B',   // Dark text
        secondary: '#84A98C',  // Muted green text/icons
        warning: '#F59E0B',    // Orange/Amber
        error: '#EF4444',      // Red
        borderMain: '#D6E3D9', // Subtle green border
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Primary typography
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(22, 101, 52, 0.05), 0 2px 4px -1px rgba(22, 101, 52, 0.03)',
      }
    },
  },
  plugins: [],
}