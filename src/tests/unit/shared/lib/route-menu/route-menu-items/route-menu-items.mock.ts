import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';

export const RECORDS: RouteRecordRaw[] = [
  { path: '/first', redirect: '/', meta: { title: 'First' } },
  { path: '/untitled', redirect: '/' },
  { path: '/second', redirect: '/', meta: { title: 'Second' } },
];

export const TITLED_LABELS = ['First', 'Second'];

export const TITLED_PATHS = ['/first', '/second'];

/**
 * Current route whose deepest matched record has the path.
 *
 * @param path path of the current page.
 */
export const createRouteMock = (path: string) => ({
  matched: [{ path: '/parent' }, { path }],
} as unknown as Pick<RouteLocationNormalizedLoaded, 'matched'>);

export const NO_MATCH_ROUTE = { matched: [] } as unknown as Pick<RouteLocationNormalizedLoaded, 'matched'>;
