/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'], 
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#ffba00',
        secondary: '#1f2937',
        background: '#1c1917',
        color_text: '#99a1af',
      },
      boxShadow: {
        'inset-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
        'inset-md': 'inset 0 4px 6px rgba(0, 0, 0, 0.1)',
        'inset-lg': 'inset 0 10px 15px rgba(0, 0, 0, 0.2)',
        'inset-primary': 'inset 0 2px 4px rgba(212, 175, 55, 0.4)',
        'inset-gradient': 'inset 3px 0  rgba(1000, 190, 80, 0.7)',
      },
    },
  },
  plugins: [],
};

