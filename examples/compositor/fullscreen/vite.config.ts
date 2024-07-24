import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        app: './app.html'
      }
    }
  },
  server: {
    host: 'localhost',
    port: 8080,
    strictPort: true,
    cors: false,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  }
});
