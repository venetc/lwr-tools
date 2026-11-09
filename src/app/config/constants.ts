import type { RouteLocationRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';
import { SITE_APPLICATION_CATEGORY, SITE_IMAGE_PATH, SITE_NAME, SITE_TAGLINE, SITE_THEME_COLOR, SITE_TOUCH_ICON_PATH } from '@shared/config/site';
import type { DeepReadonly } from '@shared/lib/object';
import type { PageRoute, PageSite } from '@shared/lib/page-head';

/**
 * Where the brand link of the site header leads: the home page.
 */
export const HOME_LOCATION = { name: ROUTES.HOME.name } as const satisfies RouteLocationRaw;

/**
 * Image of the site mark in the brand of the site header: the favicon, under the base of the build.
 */
export const SITE_MARK_SRC = `${import.meta.env.BASE_URL}favicon.svg`;

/**
 * Destinations of the site header navigation: groups of links in their order, a separator between the groups.
 * Build calculators first, then the Squad planner. A label may be shorter than the title of its route. The home page
 * and the Build calculator menu are not listed.
 */
export const SITE_NAV_GROUPS = [
  [
    { label: ROUTES.BIOSOLDIER_BUILDS.title, to: { name: ROUTES.BIOSOLDIER_BUILDS.name } },
    { label: ROUTES.MEC_BUILDS.title, to: { name: ROUTES.MEC_BUILDS.name } },
    { label: ROUTES.SHIV_BUILDS.title, to: { name: ROUTES.SHIV_BUILDS.name } },
  ],
  [
    { label: 'Squads', to: { name: ROUTES.SQUADS.name } },
  ],
] as const;

/**
 * Pages of the site whose heads the app writes to the document.
 */
export const PAGE_ROUTES: DeepReadonly<PageRoute[]> = Object.values(ROUTES);

/**
 * Site data of the page heads.
 */
export const PAGE_SITE = {
  name: SITE_NAME,
  tagline: SITE_TAGLINE,
  url: import.meta.env.SITE_URL,
  image: SITE_IMAGE_PATH,
  touchIcon: SITE_TOUCH_ICON_PATH,
  themeColor: SITE_THEME_COLOR,
  applicationCategory: SITE_APPLICATION_CATEGORY,
} as const satisfies PageSite;
