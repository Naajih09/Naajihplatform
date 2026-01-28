/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  // In a shared config, 'content' is usually empty here because 
  // the individual apps (user-web) define where to look for files.
  content: [], 
  prefix: '',
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        'gradient-custom':
          'linear-gradient(47.23deg, #3B82F6 3.53%, #80A5F5 97.44%)',
      },
      spacing: {
        4.5: '18px',
      },

      colors: {
        // --- 1. EXISTING DASHBOARD COLORS ---
        brand: {
          blue: '#0D47A1', // Trust / Corporate
          gold: '#FFC107', // Success / Energy
          dark: '#1e293b', // Text Primary
          gray: '#64748b', // Text Secondary
          bg: '#f8fafc', // Light Background
        },

        // --- 2. NEW "STITCH" LANDING COLORS (Added) ---
        primary: {
          DEFAULT: '#aaff00', // Neon Green (Stitch Primary)
          light: '#eaf1ff',   // Kept from your mentor's commented code
          'dark-light': 'rgba(67,97,238,.15)',
        },
        "background-light": "#fafafa",
        "background-dark": "#111113",
        "deep-slate": "#1c1c1f",
        "lunar-white": "#e4e4e7",

        secondary: {
            DEFAULT: '#4EABD3',
            Aero: '#4EABD3',
            light: '#ebe4f7',
            'dark-light': 'rgb(128 93 202 / 15%)',
        },
        success: {
            DEFAULT: '#D1FAE5',
            50: '#ECFDF5',
            100: '#D1FAE5',
            800: '#065F46',
            'dark-light': 'rgba(0,171,85,.15)',
        },
        danger: {
            DEFAULT: '#e7515a',
            light: '#fff5f5',
            'dark-light': 'rgba(231,81,90,.15)',
        },
        warning: {
            DEFAULT: '#e2a03f',
            light: '#fff9ed',
            'dark-light': 'rgba(226,160,63,.15)',
        },
        info: {
            DEFAULT: '#2196f3',
            light: '#e7f7ff',
            'dark-light': 'rgba(33,150,243,.15)',
        },
        dark: {
            DEFAULT: '#3b3f5c',
            light: '#eaeaec',
            'dark-light': 'rgba(59,63,92,.15)',
        },
        black: {
            DEFAULT: '#0e1726',
            light: '#e3e4eb',
            'dark-light': 'rgba(14,23,38,.15)',
        },
        white: {
            DEFAULT: '#ffffff',
            light: '#e0e6ed',
            dark: '#888ea8',
        },
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
      },
      fontFamily: {
        // Added Manrope for Stitch Design
        sans: ['"Plus Jakarta Sans"', 'Manrope', 'sans-serif'], 
        display: ['Manrope', 'sans-serif'], 

        mono: [
          'JetBrains Mono',
          'Monaco',
          'Cascadia Code',
          'Segoe UI Mono',
          'Roboto Mono',
          'Oxygen Mono',
          'Ubuntu Monospace',
          'Source Code Pro',
          'Fira Mono',
          'Droid Sans Mono',
          'Courier New',
          'monospace',
        ],
      },

      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-invert-headings': theme('colors.white.dark'),
            '--tw-prose-invert-links': theme('colors.white.dark'),
            h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
            h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
            h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
            h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
            h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
            h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
            p: { marginBottom: '0.5rem' },
            li: { margin: 0 },
            img: { margin: 0 },
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};