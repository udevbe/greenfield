import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [glsl()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 9000,
    strictPort: true
  }
})
