import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteCompression from 'vite-plugin-compression';
import { resolve } from 'path';

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
        chunkSizeWarningLimit:1000,
        // 分解块 将大块分解成较小的块
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {

                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
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
    resolve: {
        alias: {
            timers: 'timers-browserify',
        },
    }
});
