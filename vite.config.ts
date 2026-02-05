import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    babel: {
      plugins: [],
    },
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'react-hot-toast',
      'react-helmet-async',
      '@tanstack/react-query',
      'lucide-react',
      'react-is',
      'recharts',
      'date-fns',
    ],
    force: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-ui': ['lucide-react', 'react-hot-toast'],
          'vendor-utils': ['date-fns', 'recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    // 👇 TypeScript ko ignore karne ke liye exact fix
    terserOptions: {
      
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      // Content Security Policy - Note: Adjust directives based on your app's needs
      // This is a basic CSP that should be customized for production
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'self';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    fs: {
      strict: false,
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
})
