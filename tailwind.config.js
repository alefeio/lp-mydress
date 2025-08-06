module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#D32F6F', // rosa MyDress
        'secondary': '#A259D9', // roxo pastel
        'gold': '#F9E7C2', // dourado claro
        'pink-50': '#FFF1F7',
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}