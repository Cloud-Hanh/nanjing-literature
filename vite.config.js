import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts', 'react-is'],
          'vendor-motion': ['framer-motion'],
          'vendor-map': ['react-leaflet', 'leaflet'],
          'vendor-wordcloud': ['react-wordcloud'],
        },
      },
    },
  },
})
