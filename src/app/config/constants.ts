import { ROUTES } from '@shared/config/routes';
import type { BreadcrumbItem } from '@shared/ui/breadcrumbs';

/**
 * Site-wide breadcrumb that starts every trail in the site header.
 */
export const ROOT_BREADCRUMB = {
  label: 'LWR Tools',
  to: { name: ROUTES.HOME.name },
} as const satisfies BreadcrumbItem;
