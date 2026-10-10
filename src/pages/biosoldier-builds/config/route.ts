import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the Biosoldier Build calculator. The page component is loaded lazily.
 */
export const biosoldierBuildsPageRoute: RouteRecordRaw = {
  ...ROUTES.BIOSOLDIER_BUILDS,
  component: () => import('../ui/BiosoldierBuildsPage.vue'),
  meta: {
    title: 'Biosoldier',
  },
};
