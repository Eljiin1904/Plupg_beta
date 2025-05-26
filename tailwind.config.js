/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "plug-green": "#4AFF00",
        "dark-bg": "#121212",
        "dark-card": "#1E1E1E",
      },
    },
  },
  plugins: [],
};
