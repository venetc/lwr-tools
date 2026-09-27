import type { RouteLocationRaw } from 'vue-router';

export interface BreadcrumbItem {
  /** Visible label. */
  label: string
  /** Link target; ignored for the last item, which is the current page. */
  to: RouteLocationRaw
}
