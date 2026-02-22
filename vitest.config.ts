import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
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
