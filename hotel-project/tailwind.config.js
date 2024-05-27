/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
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
        'mobile': '320px'
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}