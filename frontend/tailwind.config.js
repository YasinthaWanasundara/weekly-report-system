/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#b8d0ff",
          300: "#8ab0ff",
          400: "#5a89ff",
          500: "#3763f2", // primary
          600: "#274bd1",
          700: "#1f3aa6",
          800: "#1c3184",
          900: "#1b2c6b",
        },
        slate: {
          950: "#0b1120",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
