import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const filterDeprecationWarnings = () => {
  const originalWarn = console.warn
  const originalError = console.error
  
  console.warn = (...args) => {
    const msg = args.join(' ')
    if (msg.includes('Deprecation Warning') || msg.includes('@import')) {
      return
    }
    originalWarn.apply(console, args)
  }
  
  console.error = (...args) => {
    const msg = args.join(' ')
    if (msg.includes('Deprecation Warning') || msg.includes('@import')) {
      return
    }
    originalError.apply(console, args)
  }
}

filterDeprecationWarnings()

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: `@use "sass:color"; @use "@/assets/styles/variables.scss" as *; @use "@/assets/styles/mixins.scss" as *;`
      }
    }
  }
})
