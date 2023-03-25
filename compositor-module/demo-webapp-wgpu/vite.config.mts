import wasm from 'vite-plugin-wasm'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [wasm()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 9001,
    strictPort: true
  }
})
