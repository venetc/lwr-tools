import { computed } from 'vue';
import type { RouteLocationRaw, RouteRecordRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';

export interface RouteMenuItem {
  /** Visible label: `meta.title` of the route. */
  label: string
  /** Link target: path of the route. */
  to: RouteLocationRaw
}

/**
 * Menu items of the routes with `meta.title`, in their order.
 *
 * @param records route records.
 */
export const routeMenuItems = (records: readonly RouteRecordRaw[]) => records.reduce<RouteMenuItem[]>((items, record) => {
  if (!record.meta?.title) return items;

  items.push({ label: record.meta.title, to: record.path });

  return items;
}, []);

/**
 * Pages next to the current one: menu items of the children of its parent route, and the parent title.
 * Both are empty for a top-level route.
 */
export const useSiblingRoutes = () => {
  const route = useRoute();

  const parent = computed(() => route.matched.at(-2) ?? null);

  const parentTitle = computed(() => parent.value?.meta.title ?? '');

  const items = computed(() => routeMenuItems(parent.value?.children ?? []));

  return { parentTitle, items };
};

/**
 * Top-level pages of the app: menu items of the top-level routes of the router. The routes are fixed, so the
 * items are built once.
 */
export const useTopLevelRoutes = () => {
  const router = useRouter();

  const items = routeMenuItems(router.options.routes);

  return { items };
};
