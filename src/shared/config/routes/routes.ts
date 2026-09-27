import type { RouteRecordInfo } from 'vue-router';

/**
 * Names and paths of app routes, importable from any layer.
 */
export const ROUTES = {
  HOME: {
    name: 'home',
    path: '/',
  },
  TALENTS: {
    name: 'talents',
    path: '/talents/',
  },
} as const;

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: {
      [ROUTES.HOME.name]: RouteRecordInfo<typeof ROUTES.HOME.name, typeof ROUTES.HOME.path, Record<never, never>, Record<never, never>>
      [ROUTES.TALENTS.name]: RouteRecordInfo<typeof ROUTES.TALENTS.name, typeof ROUTES.TALENTS.path, Record<never, never>, Record<never, never>>
    }
  }

  interface RouteMeta {
    /** Label of the route in the site header breadcrumbs and page menu; routes without it are skipped. */
    breadcrumb?: string
  }
}
