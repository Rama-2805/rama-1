import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl()
  ],
  server: {
    host: true,
    port: 5173,
    https: true,
    proxy: {
      '/ws-relay': {
        target: 'ws://127.0.0.1:8765',
        ws: true
      }
    }
  }
})
