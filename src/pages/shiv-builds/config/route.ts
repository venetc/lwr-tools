import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the SHIV Build calculator. The page component is loaded lazily.
 */
export const shivBuildsPageRoute: RouteRecordRaw = {
  ...ROUTES.SHIV_BUILDS,
  component: () => import('../ui/ShivBuildsPage.vue'),
  meta: {
    title: 'SHIV',
  },
};
