import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the MEC Build calculator. The page component is loaded lazily.
 */
export const mecBuildsPageRoute: RouteRecordRaw = {
  name: ROUTES.MEC_BUILDS.name,
  path: ROUTES.MEC_BUILDS.path,
  component: () => import('../ui/MecBuildsPage.vue'),
  meta: {
    title: ROUTES.MEC_BUILDS.title,
  },
};
