import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },

  server: {
    port: 3001,
    fs: {
      allow: [path.resolve(__dirname, '../..')],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react-router-dom') || id.includes('@remix-run/router')) return 'router';
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }
          if (id.includes('@reduxjs') || id.includes('react-redux') || id.includes('redux-persist')) {
            return 'state';
          }
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'forms';
          }
          if (id.includes('socket.io-client')) return 'realtime';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('date-fns')) return 'dates';
          if (id.includes('@radix-ui') || id.includes('cmdk') || id.includes('class-variance-authority')) {
            return 'ui-vendor';
          }
        },
      },
    },
  },
});
