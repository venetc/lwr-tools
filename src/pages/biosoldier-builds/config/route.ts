import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the Biosoldier Build calculator. The page component is loaded lazily.
 */
export const biosoldierBuildsPageRoute: RouteRecordRaw = {
  name: ROUTES.BIOSOLDIER_BUILDS.name,
  path: ROUTES.BIOSOLDIER_BUILDS.path,
  component: () => import('../ui/BiosoldierBuildsPage.vue'),
  meta: {
    title: ROUTES.BIOSOLDIER_BUILDS.title,
  },
};
