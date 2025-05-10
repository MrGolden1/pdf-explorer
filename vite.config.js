import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pdf-explorer/', // Set base for GitHub Pages
  plugins: [react()],
  server: {
    port: 5173,
  }
})
