import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  server: {
    host: 'localhost',
    port: 8080,
    strictPort: true,
    cors: false,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      // examples/webapps/simple-shm
      '/simple-shm': {
        target: 'http://localhost:9001',
        rewrite: (path) => path.replace(/^\/simple-shm/, ''),
      },
      // examples/webapps/webgl
      '/webgl': {
        target: 'http://localhost:9002',
        rewrite: (path) => path.replace(/^\/webgl/, ''),
      },
      // examples/webapps/weston-clients
      '/weston-clients': {
        target: 'http://localhost:9003',
        rewrite: (path) => path.replace(/^\/weston-clients/, ''),
      },
      // examples/webapps/gtk4-clients
      '/gtk4-clients': {
        target: 'http://localhost:9004',
        rewrite: (path) => path.replace(/^\/gtk4-clients/, ''),
      },
    },
  },
})
