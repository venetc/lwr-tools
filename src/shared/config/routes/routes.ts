import type { RouteRecordInfo } from 'vue-router';

/**
 * Names and paths of app routes, importable from any layer. Paths are absolute, nested routes included.
 */
export const ROUTES = {
  HOME: {
    name: 'home',
    path: '/',
  },
  BUILDS: {
    name: 'builds',
    path: '/builds',
  },
  BIOSOLDIER_BUILDS: {
    name: 'biosoldier-builds',
    path: '/builds/biosoldier',
  },
} as const;

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: {
      [ROUTES.HOME.name]: RouteRecordInfo<typeof ROUTES.HOME.name, typeof ROUTES.HOME.path, Record<never, never>, Record<never, never>>
      [ROUTES.BUILDS.name]: RouteRecordInfo<typeof ROUTES.BUILDS.name, typeof ROUTES.BUILDS.path, Record<never, never>, Record<never, never>>
      [ROUTES.BIOSOLDIER_BUILDS.name]: RouteRecordInfo<typeof ROUTES.BIOSOLDIER_BUILDS.name, typeof ROUTES.BIOSOLDIER_BUILDS.path, Record<never, never>, Record<never, never>>
    }
  }

  interface RouteMeta {
    /** Label of the route in the site header breadcrumbs and route menus; routes without it are skipped. */
    title?: string
  }
}
