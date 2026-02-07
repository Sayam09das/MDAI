import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    'alias': {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable rollup chunking optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          ui: ['lucide-react', 'framer-motion', 'recharts'],
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  // Ensure proper caching headers for production
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
