/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06060a",
        neonPurple: "#a855f7",
        neonCyan: "#06b6d4",
      },
    },
  },
  plugins: [],
};

