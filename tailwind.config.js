/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FDFBF7',
        'soft-white': '#F9F6F3',
        'antique-gold': '#B6A186',
        'charcoal': '#2C3539',
        'sage': '#8A9A8B',
        'blush': '#E8D7D5',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{
      light: {
        ...require('daisyui/src/theming/themes')['light'],
        'primary': '#8A9A8B',
        'secondary': '#B6A186',
        'accent': '#E8D7D5',
        'neutral': '#2C3539',
        'base-100': '#FDFBF7',
        'base-200': '#F9F6F3',
        'base-300': '#E8D7D5',
      },
    }],
  },
} 