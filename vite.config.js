import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lottery Assets (lotteryassets.com) — Vercel serves from the domain root,
// so no base-path rewriting is required.
export default defineConfig({
  plugins: [react()],
})
