import type { RouteRecordInfo } from 'vue-router';

/**
 * Names, paths, titles and descriptions of app routes, importable from any layer. Paths are absolute, nested routes
 * included. A title labels the route in breadcrumbs, route menus and the document title; the home page has none.
 * A description is the meta description of the page and its lead paragraph.
 */
export const ROUTES = {
  HOME: {
    name: 'home',
    path: '/',
    description: 'Plan Long War Rebalance builds for XCOM: Enemy Within: Biosoldier, MEC and SHIV perk trees, squads with loadouts, all shareable by code.',
  },
  BUILDS: {
    name: 'builds',
    path: '/builds',
    title: 'Builds',
    description: 'Build calculators for Long War Rebalance: plan Biosoldier, MEC and SHIV perks rank by rank and share each build by code.',
  },
  BIOSOLDIER_BUILDS: {
    name: 'biosoldier-builds',
    path: '/builds/biosoldier',
    title: 'Biosoldier',
    description: 'Plan Long War Rebalance Biosoldier builds: perks for every Rank of all 8 Classes, Officer perks, Gene mods and Psionic abilities.',
  },
  MEC_BUILDS: {
    name: 'mec-builds',
    path: '/builds/mec',
    title: 'MEC',
    description: 'Plan Long War Rebalance MEC builds for XCOM: Enemy Within: pick perks for every Rank of the four MEC Classes and share them by code.',
  },
  SHIV_BUILDS: {
    name: 'shiv-builds',
    path: '/builds/shiv',
    title: 'SHIV',
    description: 'Plan Long War Rebalance SHIV builds for XCOM: Enemy Within: pick SHIV perks for every Technology level and share them by code.',
  },
  SQUADS: {
    name: 'squads',
    path: '/squads',
    title: 'Squad planner',
    description: 'Plan Long War Rebalance squads: assemble Units from your saved builds, fit armor, weapons and equipment, and check every Loadout.',
  },
} as const;

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: {
      [ROUTES.HOME.name]: RouteRecordInfo<typeof ROUTES.HOME.name, typeof ROUTES.HOME.path, Record<never, never>, Record<never, never>>
      [ROUTES.BUILDS.name]: RouteRecordInfo<typeof ROUTES.BUILDS.name, typeof ROUTES.BUILDS.path, Record<never, never>, Record<never, never>>
      [ROUTES.BIOSOLDIER_BUILDS.name]: RouteRecordInfo<typeof ROUTES.BIOSOLDIER_BUILDS.name, typeof ROUTES.BIOSOLDIER_BUILDS.path, Record<never, never>, Record<never, never>>
      [ROUTES.MEC_BUILDS.name]: RouteRecordInfo<typeof ROUTES.MEC_BUILDS.name, typeof ROUTES.MEC_BUILDS.path, Record<never, never>, Record<never, never>>
      [ROUTES.SHIV_BUILDS.name]: RouteRecordInfo<typeof ROUTES.SHIV_BUILDS.name, typeof ROUTES.SHIV_BUILDS.path, Record<never, never>, Record<never, never>>
      [ROUTES.SQUADS.name]: RouteRecordInfo<typeof ROUTES.SQUADS.name, typeof ROUTES.SQUADS.path, Record<never, never>, Record<never, never>>
    }
  }

  interface RouteMeta {
    /** Label of the route in the site header breadcrumbs and route menus; routes without it are skipped. */
    title?: string
  }
}
