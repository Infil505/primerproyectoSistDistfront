import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // o react si aplica

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, '/.netlify/functions'),
      },
    },
  },
})
