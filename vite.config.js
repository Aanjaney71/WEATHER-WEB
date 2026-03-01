import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Deduplicate three.js and react so there's only ONE instance bundled
    dedupe: ['three', 'react', 'react-dom', '@react-three/fiber', '@react-three/drei'],
  },
  optimizeDeps: {
    // Force include these to ensure they're pre-bundled correctly
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    exclude: [],
  },
})
