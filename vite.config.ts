import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@app': resolve(import.meta.dirname, './src/app'),
      '@pages': resolve(import.meta.dirname, './src/pages'),
      '@widgets': resolve(import.meta.dirname, './src/widgets'),
      '@features': resolve(import.meta.dirname, './src/features'),
      '@entities': resolve(import.meta.dirname, './src/entities'),
      '@shared': resolve(import.meta.dirname, './src/shared'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          fileURLToPath(new URL('./src/shared', import.meta.url)),
        ],
      },
    },
  },
});
