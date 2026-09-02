/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C2B39",
        paper: "#F8F5EF",
        rule: "#DCD5C6",
        forest: "#2C5530",
        forestSoft: "#E5EBE1",
        brass: "#A6802D",
        brassSoft: "#F1E9D6",
        rust: "#B0472B",
        rustSoft: "#F7E5DE",
        slate: "#6B7280",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
