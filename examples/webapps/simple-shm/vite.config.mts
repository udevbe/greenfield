import { defineConfig } from "vite";

export default defineConfig({
  base: '/simple-shm',
  server: {
    port: 9002,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "same-origin"
    }
  }
});
