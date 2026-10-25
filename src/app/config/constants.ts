import { ROUTES } from '@shared/config/routes';
import { SITE_APPLICATION_CATEGORY, SITE_IMAGE_PATH, SITE_NAME, SITE_TAGLINE, SITE_THEME_COLOR, SITE_TOUCH_ICON_PATH } from '@shared/config/site';
import type { DeepReadonly } from '@shared/lib/object';
import type { PageRoute, PageSite } from '@shared/lib/page-head';
import type { BreadcrumbItem } from '@shared/ui/breadcrumbs';

/**
 * Site-wide breadcrumb that starts every trail in the site header.
 */
export const ROOT_BREADCRUMB = {
  label: SITE_NAME,
  to: { name: ROUTES.HOME.name },
} as const satisfies BreadcrumbItem;

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
