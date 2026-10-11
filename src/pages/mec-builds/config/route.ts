import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the MEC Build calculator. The page component is loaded lazily.
 */
export const mecBuildsPageRoute: RouteRecordRaw = {
  ...ROUTES.MEC_BUILDS,
  component: () => import('../ui/MecBuildsPage.vue'),
  meta: {
    title: 'MEC',
  },
};
