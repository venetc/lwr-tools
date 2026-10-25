import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import svgLoader from 'vite-svg-loader';

import { pageHtml } from './vite-plugins/page-html';

/**
 * Absolute URL of the site root without a trailing slash: `SITE_URL` when set, the dev server otherwise. Its path
 * with a trailing slash is the base of the build, and the app reads it as `import.meta.env.SITE_URL`.
 */
const siteUrl = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/+$/, '');

export default defineConfig({
  base: `${new URL(siteUrl).pathname.replace(/\/$/, '')}/`,
  define: {
    'import.meta.env.SITE_URL': JSON.stringify(siteUrl),
  },
  plugins: [
    vue(),
    pageHtml(siteUrl),
    svgLoader({ defaultImport: 'url', svgo: false }),
    imagetools({
      /** Ability, gene mod, psionic ability and SHIV perk icon masters (with state variants for trees), up to 256px each. */
      include: '**/config/icons/{abilities,perks,gene-mods,psionic}/*/*.png',
      /** 128px covers the 44px cell up to 3x DPR. */
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
