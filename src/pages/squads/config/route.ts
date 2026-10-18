import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the Squad planner. The page component is loaded lazily.
 */
export const squadsPageRoute: RouteRecordRaw = {
  ...ROUTES.SQUADS,
  component: () => import('../ui/SquadsPage.vue'),
  meta: {
    title: 'Squad planner',
  },
};
