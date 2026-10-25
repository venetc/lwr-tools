import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the Squad planner. The page component is loaded lazily.
 */
export const squadsPageRoute: RouteRecordRaw = {
  name: ROUTES.SQUADS.name,
  path: ROUTES.SQUADS.path,
  component: () => import('../ui/SquadsPage.vue'),
  meta: {
    title: ROUTES.SQUADS.title,
  },
};
