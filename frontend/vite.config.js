import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    historyApiFallback: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('react-router-dom')) {
            return 'router'
          }

          if (id.includes('framer-motion') || id.includes('/motion/')) {
            return 'motion'
          }

          if (id.includes('@supabase')) {
            return 'supabase'
          }

          if (id.includes('@tsparticles') || id.includes('cobe')) {
            return 'visual-effects'
          }

          if (id.includes('lucide-react') || id.includes('swiper')) {
            return 'ui-kit'
          }

          return 'vendor'
        },
      },
    },
  },
})
