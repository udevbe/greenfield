import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [glsl()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        app: './app.html'
      }
    }
  }
})
