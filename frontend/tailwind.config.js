/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'audiowide': ['Audiowide', 'cursive'],
        'nunito-sans': ['Nunito Sans', 'sans-serif'],
        'vina-sans': ['Vina Sans', 'cursive'],
        'italiana': ['Italiana', 'serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

