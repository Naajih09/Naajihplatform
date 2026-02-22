// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//       },
//       colors: {
//         brand: {
//           blue: '#0D47A1',   // Trust / Corporate
//           gold: '#FFC107',   // Success / Energy
//           dark: '#1e293b',   // Text Primary
//           gray: '#64748b',   // Text Secondary
//           bg: '#f8fafc',     // Light Background
//         }
//       }
//     },
//   },
//   plugins: [],
// }

const baseConfig = require('@repo/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,

   darkMode: 'class',
   
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],


};
