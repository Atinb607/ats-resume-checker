// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Define your base path as relative (especially if not deploying at root)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Helps Vercel serve routes correctly
  server: {
    port: 5173, // Optional: define your local dev port
  }
})
