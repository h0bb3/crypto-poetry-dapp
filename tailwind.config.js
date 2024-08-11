/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        input: 'var(--input)',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'checked'],
      borderColor: ['checked'],
      translate: ['checked'],
    },
  },
  mode: 'jit',
}