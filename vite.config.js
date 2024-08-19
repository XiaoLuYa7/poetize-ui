import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteCompression from 'vite-plugin-compression';

export default defineConfig({
    base: './',
    server: {
        port: 80,
        https: false,
        open: false,
        host: process.env.VITE_HOST,
    },
    build: {
        sourcemap: false,
    },
    plugins: [
        vue(),
        ViteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240,
            deleteOriginFile: false,
        })
    ],
});
