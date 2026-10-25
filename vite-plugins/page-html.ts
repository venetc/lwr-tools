import type { Plugin } from 'vite';

import { ROUTES } from '../src/shared/config/routes/index.ts';
import { SITE_APPLICATION_CATEGORY, SITE_IMAGE_PATH, SITE_NAME, SITE_TAGLINE, SITE_THEME_COLOR, SITE_TOUCH_ICON_PATH } from '../src/shared/config/site/index.ts';
import type { PageSite } from '../src/shared/lib/page-head/index.ts';
import { pageHeadHtml, pageNoscriptHtml, resolvePageHead } from '../src/shared/lib/page-head/index.ts';

/** Path on no route list: its head goes to `404.html`. */
const NOT_FOUND_PATH = '/404';

/**
 * HTML of a page per route, so a host of static files answers every route with its own head and status 200.
 * The build writes the root to `index.html`, any other route to `<path>.html` (an address without a trailing
 * slash needs no redirect), and a path off the list to `404.html` with `noindex`. Each file is the app shell with
 * the head and the `<noscript>` content of its path. The dev server serves `index.html` with the head of the root;
 * the app applies the head of the current path itself.
 *
 * @param siteUrl absolute URL of the site root without a trailing slash.
 */
export const pageHtml = (siteUrl: string): Plugin => {
  const routes = Object.values(ROUTES);
  const site = {
    name: SITE_NAME,
    tagline: SITE_TAGLINE,
    url: siteUrl,
    image: SITE_IMAGE_PATH,
    touchIcon: SITE_TOUCH_ICON_PATH,
    themeColor: SITE_THEME_COLOR,
    applicationCategory: SITE_APPLICATION_CATEGORY,
  } as const satisfies PageSite;

  /**
   * App shell with the head and the `<noscript>` content of the path.
   *
   * @param shell HTML of the app shell.
   * @param path path of the page.
   */
  const pageShell = (shell: string, path: string) => shell
    .replace('</head>', `${pageHeadHtml(resolvePageHead(routes, site, path))}\n</head>`)
    .replace('<body>', `<body>\n${pageNoscriptHtml(routes, site, path)}`);

  return {
    name: 'page-html',
    enforce: 'post',
    /**
     * Gives the page of the dev server the head of the root; a build leaves the shell to `generateBundle`.
     *
     * @param html HTML of the app shell.
     * @param context where the HTML is served: `server` is set in dev only.
     */
    transformIndexHtml(html, context) {
      if (!context.server) return html;

      return pageShell(html, ROUTES.HOME.path);
    },
    /**
     * Writes a page of every route besides the root and `404.html` from the built `index.html`, then gives
     * `index.html` the head of the root.
     *
     * @param _ output options.
     * @param bundle files of the build.
     */
    generateBundle(_, bundle) {
      const index = bundle['index.html'];

      if (index?.type !== 'asset') return;

      const shell = String(index.source);

      routes.forEach((route) => {
        if (route.path === ROUTES.HOME.path) return;

        this.emitFile({ type: 'asset', fileName: `${route.path.slice(1)}.html`, source: pageShell(shell, route.path) });
      });

      this.emitFile({ type: 'asset', fileName: '404.html', source: pageShell(shell, NOT_FOUND_PATH) });

      index.source = pageShell(shell, ROUTES.HOME.path);
    },
  };
};
