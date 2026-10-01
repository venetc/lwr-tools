import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({ defaultImport: 'url', svgo: false }),
    imagetools({
      /** Ability icon masters (soldier ones with state variants), up to 256px each. */
      include: '**/config/icons/abilities/*/*.png',
      /** 128px covers the 44px cell up to 3x DPR. */
      defaultDirectives: new URLSearchParams({ w: '128', format: 'webp', quality: '85' }),
    }),
  ],
  resolve: {
    alias: {
      '@app': resolve(import.meta.dirname, './src/app'),
      '@pages': resolve(import.meta.dirname, './src/pages'),
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
