import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import svgLoader from 'vite-svg-loader';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({ defaultImport: 'url', svgo: false }),
    // Мастера абилок 256px: в ячейке 44px, 128px хватает до 3x DPR
    imagetools({
      include: '**/assets/images/abilities/*.png',
      defaultDirectives: new URLSearchParams({ w: '128', format: 'webp', quality: '85' }),
    }),
  ],
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
