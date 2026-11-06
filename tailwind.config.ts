import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4285F4',
          hover: '#3367D6',
          light: '#E8F0FE',
          dark: '#1A73E8',
        },
        secondary: {
          DEFAULT: '#34A853',
          hover: '#2D9249',
          light: '#E6F4EA',
          dark: '#1E8E3E',
        },
        danger: {
          DEFAULT: '#EA4335',
          hover: '#D33426',
          light: '#FCE8E6',
          dark: '#D93025',
        },
        accent: {
          DEFAULT: '#EA4335',
          hover: '#D33426',
          light: '#FCE8E6',
        },
        warning: {
          DEFAULT: '#FBBC04',
          hover: '#F5A623',
          light: '#FEF7E0',
          dark: '#F29900',
        },
        surface: '#FFFFFF',
        background: '#F8F9FA',
        border: '#E8EAED',
        'text-primary': '#202124',
        'text-secondary': '#5F6368',
      },
      fontFamily: {
        sans: ['Google Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'card-hover': '0 2px 6px rgba(60,64,67,0.3), 0 8px 12px 6px rgba(60,64,67,0.15)',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
