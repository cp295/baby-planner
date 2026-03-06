/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        baby: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f3d0fe",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
      },
    },
  },
  plugins: [],
};
