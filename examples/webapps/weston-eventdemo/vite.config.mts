import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: "inline"
  },
  preview: {
    port: 9003,
    strictPort: true
  }
});
