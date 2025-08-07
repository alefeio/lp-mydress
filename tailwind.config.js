/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta: Logo e Fundos (Base mostarda e escala de cinza)
        background: {
          50: "#fefaf5",
          100: "#fdf4e7",
          200: "#f8e6c6",
          300: "#eacc9d",
          400: "#e1b879",
          500: "#d2a35a",
          600: "#ba8741",
          700: "#996a2c",
          800: "#734d1b",
          900: "#3e2d10",
          950: "#201707",
          1000: "#120d04",
        },
        graytone: {
          50: "#f8f8f8",
          100: "#f0f0f0",
          200: "#dedede",
          300: "#c3c3c3",
          400: "#a9a9a9",
          500: "#8f8f8f",
          600: "#737373",
          700: "#595959",
          800: "#3f3f3f",
          900: "#262626",
          950: "#151515",
          1000: "#0a0a0a",
        },

        // Paleta: Títulos e Textos (Base terracota e escala de cinza)
        textcolor: {
          50: "#fef8f3",
          100: "#fceee4",
          200: "#f7d3b8",
          300: "#ecaa81",
          400: "#df8651",
          500: "#d26b34",
          600: "#b95327",
          700: "#963f1e",
          800: "#6e2c16",
          900: "#401a0c",
          950: "#230e05",
          1000: "#120702",
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
}
