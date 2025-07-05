/** @type {import('tailwindcss').Config} */
const config =  {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',      // For App Router
    './pages/**/*.{js,ts,jsx,tsx}',    // For Pages Router
    './components/**/*.{js,ts,jsx,tsx}' // If you store components here
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1c7ea8',
          light: '#fef3c7',
          dark: '#b45309',
        },
      },
    },
  },
  plugins: [],
}

export default config