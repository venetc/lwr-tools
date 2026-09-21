import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@assets': resolve(import.meta.dirname, './src/assets'),
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
