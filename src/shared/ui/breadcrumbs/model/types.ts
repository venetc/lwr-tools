import type { RouteLocationRaw } from 'vue-router';

export interface BreadcrumbMenuItem {
  /** Visible label. */
  label: string
  /** Link target. */
  to: RouteLocationRaw
  /** Whether the item leads to the current page. */
  isCurrent: boolean
}

export interface BreadcrumbItem {
  /** Visible label. */
  label: string
  /** Link target; ignored for the last item, which is the current page, and for items with a menu. */
  to: RouteLocationRaw
  /** Links opened from the item instead of following `to`. */
  menu?: BreadcrumbMenuItem[]
}
