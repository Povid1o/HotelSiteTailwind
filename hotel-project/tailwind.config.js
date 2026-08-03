/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    "./src/components/styles/**/*.css",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px', 
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors:{
        'main_theme': '#1F4D4A',
        'ink': '#19312F',
        'sand': '#F5F2EA',
        'clay': '#C7774D',
        'mist': '#DCE5DE'
      },
      
      fontFamily: {
        body: ['Manrope', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      screens: {
        'mobile': '320px',
        'tabletMini': '520px', 
        "max-sm": { max: "639px" },  
        "max-md": { max: "767px" },
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
});
