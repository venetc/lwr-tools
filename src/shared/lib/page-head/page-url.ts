import type { PageSite } from './page-head.ts';

/**
 * Absolute URL of the page without a trailing slash; the root is the site URL with one, as a host serves it
 * without a redirect.
 *
 * @param site site data.
 * @param path path of the page.
 */
export const pageUrl = (site: PageSite, path: string) => `${site.url}${path === '/' ? '/' : path}`;
