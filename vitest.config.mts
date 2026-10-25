import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: true,
    server: {
      deps: {
        inline: ['next-intl']
      }
    },
    coverage: {
      provider: 'v8',
      exclude: [
        'messages/**',
        'src/components/ui/**',
        'next.config.ts',
        'postcss.config.mjs',
        'tailwind.config.ts',
        '.next/**',
        'node_modules/**',
        'tests/**'
      ]
    }
  }
})
