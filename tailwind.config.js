/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        purple: '#7C3AED',
        sky: '#60A5FA',
        yellow: '#FACC15',
        surface: '#EDE9FE',
        dark: '#0F172A',
        blacksection: '#1E293B',
        strokedark: '#475569',
        stroke: '#DBEAFE',
        'body-color': '#475569',
        'body-color-dark': '#DBEAFE',
        light: '#F8FAFC',
        waterhole: '#EDE9FE',
        pink: '#F472B6',
        green: '#60A5FA',
        orange: '#FACC15',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'solid-13': '0px 8px 70px rgba(0, 0, 0, 0.05)',
        'solid-8': '0px 2px 10px rgba(0, 0, 0, 0.08)',
        'solid-3': '0px 6px 30px rgba(0, 0, 0, 0.03)',
        'solid-6': '0px 6px 30px rgba(79, 70, 229, 0.1)',
        'solid-4': '0px 6px 90px rgba(8, 14, 40, 0.04)',
        'solid-11': '0px 10px 25px rgba(79, 70, 229, 0.2)',
      },
    },
  },
  plugins: [],
}
