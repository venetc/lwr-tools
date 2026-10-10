import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { routeMenuItems } from '@shared/lib/route-menu';
import type { BreadcrumbItem } from '@shared/ui/breadcrumbs';

import { ROOT_BREADCRUMB } from '../config/constants';

/**
 * Breadcrumb trail of the current route: the root with a menu of the top-level routes, then the titled matched
 * routes; a nested one gets a menu of the titled children of its parent.
 */
export const useBreadcrumbs = () => {
  const route = useRoute();
  const router = useRouter();

  const breadcrumbs = computed(() => route.matched.reduce<BreadcrumbItem[]>((items, record, index) => {
    if (!record.meta.title) return items;

    const parent = route.matched[index - 1] ?? null;

    if (!parent) {
      items.push({ label: record.meta.title, to: record.path });
      return items;
    }

    items.push({ label: record.meta.title, to: record.path, menu: routeMenuItems(parent.children, route) });

    return items;
  }, [{ ...ROOT_BREADCRUMB, menu: routeMenuItems(router.options.routes, route) }]));

  return { breadcrumbs };
};
