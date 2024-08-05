/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sgblack: "#161615",
        sgred: "#b30000",
      },
    },
  },
  plugins: [],
};
