import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: process.env.NODE_ENV === 'production' ? '/home/' : '/',
  base: '/domus/',
  server: {
    // This helps Vite distinguish between your Linux /home folder 
    // and the /home base path
    origin: 'http://localhost:5173',
  }
})
