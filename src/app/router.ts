import type { Router } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import { talentsPageRoute } from '@pages/talents';
import { ROUTES } from '@shared/config/routes';

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      ...ROUTES.HOME,
      redirect: { name: ROUTES.TALENTS.name },
    },
    talentsPageRoute,
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: ROUTES.TALENTS.name },
    },
  ],
});
