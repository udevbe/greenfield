import { defineConfig } from "vite";

export default defineConfig({
  base: "/shm",
  build: {
    sourcemap: "inline"
  },
  preview: {
    port: 9002,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "same-origin"
    }
  }
});
