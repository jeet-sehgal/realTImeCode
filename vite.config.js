import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/exe":"wss://realtimecode-ypcz.onrender.com"
    }
  },
  plugins: [react()],
})
