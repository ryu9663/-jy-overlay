import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Dev server uses source for fast library iteration.
// Production build intentionally resolves the package entry so it verifies dist output.
export default defineConfig(({ command }) => ({
  plugins: command === 'serve' ? [react(), tailwindcss()] : [react()],
  resolve: {
    alias:
      command === 'serve'
        ? {
            '@ryu9663/overlay': resolve(__dirname, '../src/index.ts'),
          }
        : undefined,
  },
}))
