import { ROUTES } from '@shared/config/routes';
import { SITE_NAME } from '@shared/config/site';
import type { BreadcrumbItem } from '@shared/ui/breadcrumbs';

/**
 * Site-wide breadcrumb that starts every trail in the site header.
 */
export const ROOT_BREADCRUMB = {
  label: SITE_NAME,
  to: { name: ROUTES.HOME.name },
} as const satisfies BreadcrumbItem;
