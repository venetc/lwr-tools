import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';
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

/**
 * Crumbs of the trail: the last one is the current page, the others are followed by a separator.
 *
 * @param items trail from the root to the current page.
 */
export const useCrumbs = (items: MaybeRefOrGetter<readonly BreadcrumbItem[]>) => {
  return computed(() => {
    const trail = toValue(items);

    return trail.map((item, index) => {
      const isCurrent = index === trail.length - 1;

      return { ...item, isCurrent, hasSeparator: !isCurrent };
    });
  });
};
