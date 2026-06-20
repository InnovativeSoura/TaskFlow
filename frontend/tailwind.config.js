/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6D5DFE",
        dark: "#0F172A",
      },
    },
  },
  plugins: [],
};