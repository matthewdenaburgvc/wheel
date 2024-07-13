/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './src/components/**/*.{html,js}',
    './src/index.html'
  ],
  darkMode: 'selector',
  theme: {
    colors: {
      white: '#fff',
      gray: {
        100: '#f0f0f0',
        200: '#e5e5e5',
        300: '#ccc',
        400: '#aaa',
        500: '#888',
        600: '#727272',
        700: '#666',
        800: '#444',
        900: '#222',
      },
      black: '#000',
    },
    fontFamily: {
      sans: ["Arial", "sans-serif"],
      serif: ["Georgia", "serif"],
    },
    extend: {
      colors: {
        blue: {
          400: '#39c',
          700: '#069',
        },
      },
    },
  },
  plugins: [],
}