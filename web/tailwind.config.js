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
        // Primary - Trust & Medical Blue
        primary: {
          DEFAULT: 'hsl(210, 100%, 45%)', // #0070E6 - Darker, more professional
          dark: 'hsl(210, 100%, 35%)',    // #0059B3 - Even darker for hover
          light: 'hsl(210, 100%, 95%)',    // #E6F4FF
        },
        // Semantic Colors
        success: 'hsl(142, 76%, 45%)',     // #1CB854
        warning: 'hsl(38, 92%, 55%)',      // #F59E0B
        error: 'hsl(0, 84%, 60%)',         // #EF4444
        info: 'hsl(210, 100%, 45%)',       // #0070E6 - Match primary
        // Neutral Palette (High Contrast for Accessibility)
        background: 'hsl(0, 0%, 100%)',    // White
        surface: 'hsl(210, 20%, 98%)',     // Off-white
        border: 'hsl(210, 20%, 90%)',      // Light gray
        'text-primary': 'hsl(210, 20%, 10%)',    // Near black
        'text-secondary': 'hsl(210, 15%, 40%)',  // Medium gray
        'text-disabled': 'hsl(210, 10%, 60%)',   // Light gray
        // Data Visualization
        'spo2-healthy': 'hsl(142, 76%, 45%)',    // Green
        'spo2-warning': 'hsl(38, 92%, 55%)',     // Orange
        'spo2-critical': 'hsl(0, 84%, 60%)',     // Red
        'heart-rate': 'hsl(0, 84%, 60%)',        // Red
      },
      fontSize: {
        // Typography scale optimized for elderly users
        'body-lg': ['1.25rem', { lineHeight: '1.6', fontWeight: '400' }],  // 20px
        'body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],     // 18px
        'body-sm': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],      // 16px
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],  // 14px
      },
      spacing: {
        // 8px base scale
        '18': '4.5rem',  // 72px - Large touch targets
        '22': '5.5rem',  // 88px
      },
      borderRadius: {
        'sm': '0.5rem',   // 8px
        'md': '0.75rem',  // 12px
        'lg': '1rem',     // 16px
        'xl': '1.5rem',   // 24px
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12)',
        'elevation-2': '0 4px 6px rgba(0,0,0,0.1)',
        'elevation-3': '0 10px 15px rgba(0,0,0,0.1)',
        'elevation-4': '0 20px 25px rgba(0,0,0,0.15)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-in-out',
        'slide-up': 'slideUp 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
