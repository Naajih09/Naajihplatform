import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('react-router-dom') || id.includes('@remix-run/router')) return 'router'
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor'
          }
          if (id.includes('recharts') || id.includes('d3-')) return 'charts'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('axios')) return 'network'
          if (id.includes('@radix-ui') || id.includes('cmdk') || id.includes('class-variance-authority')) {
            return 'ui-vendor'
          }
        },
      },
    },
  },
})
