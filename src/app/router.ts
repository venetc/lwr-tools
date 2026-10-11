import type { Router } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import { biosoldierBuildsPageRoute } from '@pages/biosoldier-builds';
import { buildsPageRoute } from '@pages/builds';
import { shivBuildsPageRoute } from '@pages/shiv-builds';
import { ROUTES } from '@shared/config/routes';

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      ...ROUTES.HOME,
      redirect: { name: ROUTES.BUILDS.name },
    },
    {
      path: ROUTES.BUILDS.path,
      meta: {
        title: 'Builds',
      },
      children: [
        buildsPageRoute,
        biosoldierBuildsPageRoute,
        shivBuildsPageRoute,
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: ROUTES.HOME.name, params: {} },
    },
  ],
});
