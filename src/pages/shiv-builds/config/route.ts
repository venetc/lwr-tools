import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the SHIV Build calculator. The page component is loaded lazily.
 */
export const shivBuildsPageRoute: RouteRecordRaw = {
  name: ROUTES.SHIV_BUILDS.name,
  path: ROUTES.SHIV_BUILDS.path,
  component: () => import('../ui/ShivBuildsPage.vue'),
  meta: {
    title: ROUTES.SHIV_BUILDS.title,
  },
};
