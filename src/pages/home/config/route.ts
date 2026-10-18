import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the home page: the menu of the tools. It has no title: the trail starts with the site name.
 * The page component is loaded lazily.
 */
export const homePageRoute: RouteRecordRaw = {
  ...ROUTES.HOME,
  component: () => import('../ui/HomePage.vue'),
};
