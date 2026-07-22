import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/odata': {
        target: 'http://localhost:4004',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:4004',
        changeOrigin: true,
      },
    },
  },
})
