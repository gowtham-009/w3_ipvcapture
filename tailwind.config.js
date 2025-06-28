/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      animation: {
        'google-bounce': 'google-bounce 1.4s infinite ease-in-out both',
      },
      keyframes: {
        'google-bounce': {
          '0%, 80%, 100%': { 
            transform: 'scale(0)',
            opacity: '0.5'
          },
          '40%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
        }
      }
    }
  },
  plugins: [],
}