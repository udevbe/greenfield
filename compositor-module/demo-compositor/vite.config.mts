import { defineConfig } from 'vite'
import preact from "@preact/preset-vite";


export default defineConfig({
  plugins: [preact()],
  root: './demo-compositor',
  server: {
    port: 8080,
    strictPort: true,
  },
})

