import {defineConfig} from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
    plugins: [preact()],
    server: {
        host: 'localhost',
        port: 8080,
        strictPort: true,
        cors: false,
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp"
        },
        proxy: {
            // example webapp simple-shm
            '/simple-shm': 'http://localhost:9002',
            // example webapp weston-eventdemo
            '/weston-eventdemo': 'http://localhost:9003',
        }
    },
});

