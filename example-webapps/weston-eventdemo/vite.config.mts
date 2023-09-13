import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: "inline"
  },
  preview: {
    port: 9003,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "same-origin"
    }
  }
});
