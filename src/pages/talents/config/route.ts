import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@shared/config/routes';

/**
 * Route record of the talents page. The page component is loaded lazily.
 */
export const talentsPageRoute: RouteRecordRaw = {
  ...ROUTES.TALENTS,
  component: () => import('../ui/TalentsPage.vue'),
  meta: {
    breadcrumb: 'Talents',
  },
};
