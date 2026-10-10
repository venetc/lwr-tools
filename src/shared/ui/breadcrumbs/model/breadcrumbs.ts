import type { RouteLocationRaw } from 'vue-router';

import type { RouteMenuItem } from '@shared/lib/route-menu';

export type BreadcrumbMenuItem = RouteMenuItem;

export interface BreadcrumbItem {
  /** Visible label. */
  label: string
  /** Link target; ignored for the last item, which is the current page, and for items with a menu. */
  to: RouteLocationRaw
  /** Links opened from the item instead of following `to`. */
  menu?: BreadcrumbMenuItem[]
}
