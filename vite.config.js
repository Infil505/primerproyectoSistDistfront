import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://lucent-toffee-15f013.netlify.app/',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, '/.netlify/functions'),
      },
    },
  },
})
