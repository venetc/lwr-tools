import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { BreadcrumbItem, BreadcrumbMenuItem } from '@shared/ui/breadcrumbs';

import { ROOT_BREADCRUMB } from '../config/constants';

/**
 * Breadcrumb trail of the current route: the root with a menu of all titled routes, then the titled matched routes.
 */
export const useBreadcrumbs = () => {
  const route = useRoute();
  const router = useRouter();

  const navigationMenu = computed(() => router.options.routes.reduce<BreadcrumbMenuItem[]>((items, record) => {
    if (!record.meta?.breadcrumb) return items;

    items.push({
      label: record.meta.breadcrumb,
      to: record.path,
      isCurrent: route.name === record.name,
    });

    return items;
  }, []));

  const breadcrumbs = computed(() => route.matched.reduce<BreadcrumbItem[]>((items, record) => {
    if (!record.meta.breadcrumb) return items;

    items.push({ label: record.meta.breadcrumb, to: record.path });

    return items;
  }, [{ ...ROOT_BREADCRUMB, menu: navigationMenu.value }]));

  return { breadcrumbs };
};
