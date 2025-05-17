/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    "./src/componemts/styles/vinery.css",
  ],
  theme: {
    extend: {
      colors:{
        'main_theme': '#80143c'
      },
      
      fontFamily: {
        body : ['Bitter'],
        // sans: ['Graphik', 'sans-serif'],
      },
      screens: {
        'mobile': '320px',
        'tabletMini': '520px', 
        "max-sm": { max: "639px" },  // Обратите внимание на кавычки и префикс "max-"
        "max-md": { max: "767px" },
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
});