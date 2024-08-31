/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bgGrey: '#0C0C0C',
        elGrey: '#212121',
      },
      fontFamily: {
        DMSans: ['DMSans', 'sans-serif'],
      },
      height: {
        '10v': '10vh',
        '20v': '20vh',
        '25v': '25vh',
        '30v': '30vh',
        '40v': '40vh',
        '50v': '50vh',
        '60v': '60vh',
        '69v': '69vh',
        '70v': '70vh',
        '76v': '76vh',
        '80v': '80vh',
        '86v': '86vh',
        '87v': '87vh',
        '90v': '90vh',
        '95v': '95vh',
        '100v': '100vh',
      },
    },
  },
  plugins: [],
};
