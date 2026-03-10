  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import { fileURLToPath, URL } from 'node:url'

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
<<<<<<< Updated upstream
    build: {
      rollupOptions: {
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
=======
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
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
>>>>>>> Stashed changes
