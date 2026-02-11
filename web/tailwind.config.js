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
        primary: {
          DEFAULT: 'hsl(232, 94%, 66%)',
          dark: 'hsl(232, 94%, 56%)',
        },
        secondary: 'hsl(280, 89%, 65%)',
        accent: 'hsl(185, 84%, 57%)',
        success: 'hsl(142, 76%, 56%)',
        warning: 'hsl(38, 92%, 65%)',
        error: 'hsl(0, 84%, 60%)',
        background: 'hsl(240, 10%, 6%)',
        surface: 'hsl(240, 8%, 12%)',
        'surface-light': 'hsl(240, 6%, 18%)',
        'text-primary': 'hsl(0, 0%, 98%)',
        'text-secondary': 'hsl(240, 5%, 70%)',
        'text-muted': 'hsl(240, 5%, 50%)',
      },
      borderRadius: {
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-in-out',
        'slide-up': 'slideUp 350ms ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
