import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
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
    chunkSizeWarningLimit: 800,
    // Drop console.* in production — saves ~5 KB and removes debug noise
    esbuild: { drop: ['console', 'debugger'] },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
      output: {
        // Fine-grained chunks: browsers can cache each independently and only
        // re-download the chunk that actually changed between deploys.
        manualChunks: {
          vendor:    ['react', 'react-dom', 'react-router-dom'],
          motion:    ['framer-motion'],
          icons:     ['lucide-react'],
          particles: ['@tsparticles/react', '@tsparticles/slim'],
          globe:     ['cobe'],
          swiper:    ['swiper'],
          // xlsx is heavy (~500 KB) — only loaded on PublicationsPage
          excel:     ['xlsx'],
          confetti:  ['canvas-confetti'],
        },
      },
    },
  },
})
