import { computed } from 'vue';
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, RouteRecordRaw } from 'vue-router';
import { useRoute } from 'vue-router';

export interface RouteMenuItem {
  /** Visible label: `meta.title` of the route. */
  label: string
  /** Link target: path of the route. */
  to: RouteLocationRaw
  /** Whether the item leads to the current page. */
  isCurrent: boolean
}

/**
 * Menu items of the routes with `meta.title`, in their order. An item is current if its path is the path
 * of the deepest matched record; paths are compared as written, so records need absolute paths.
 *
 * @param records route records.
 * @param route current route.
 */
export const routeMenuItems = (
  records: readonly RouteRecordRaw[],
  route: Pick<RouteLocationNormalizedLoaded, 'matched'>,
) => {
  const currentPath = route.matched.at(-1)?.path;

  return records.reduce<RouteMenuItem[]>((items, record) => {
    if (!record.meta?.title) return items;

    items.push({ label: record.meta.title, to: record.path, isCurrent: record.path === currentPath });

    return items;
  }, []);
};

/**
 * Pages next to the current one: menu items of the children of its parent route, and the parent title.
 * Both are empty for a top-level route.
 */
export const useSiblingRoutes = () => {
  const route = useRoute();

  const parent = computed(() => route.matched.at(-2) ?? null);

  const parentTitle = computed(() => parent.value?.meta.title ?? '');

  const items = computed(() => routeMenuItems(parent.value?.children ?? [], route));

  return { parentTitle, items };
};
