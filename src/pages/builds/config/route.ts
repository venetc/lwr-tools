import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the Build calculator menu. It has no title of its own: the trail shows the title of the parent
 * route. The page component is loaded lazily.
 */
export const buildsPageRoute: RouteRecordRaw = {
  ...ROUTES.BUILDS,
  component: () => import('../ui/BuildsPage.vue'),
};
