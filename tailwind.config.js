/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: {
          light: "rgb(var(--primary-light) / <alpha-value>)",
          DEFAULT: "rgb(var(--primary-color) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary-color) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "rgb(var(--accent-color) / <alpha-value>)"
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}; 