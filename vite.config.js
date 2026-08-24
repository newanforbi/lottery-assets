import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel serves from the domain root — no base path rewriting needed.
export default defineConfig({
  plugins: [react()],
})
