import type { Router } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import { biosoldierBuildsPageRoute } from '@pages/biosoldier-builds';
import { buildsPageRoute } from '@pages/builds';
import { homePageRoute } from '@pages/home';
import { mecBuildsPageRoute } from '@pages/mec-builds';
import { shivBuildsPageRoute } from '@pages/shiv-builds';
import { squadsPageRoute } from '@pages/squads';
import { ROUTES } from '@shared/config/routes';

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    homePageRoute,
    {
      path: ROUTES.BUILDS.path,
      meta: {
        title: 'Builds',
      },
      children: [
        buildsPageRoute,
        biosoldierBuildsPageRoute,
        mecBuildsPageRoute,
        shivBuildsPageRoute,
      ],
    },
    squadsPageRoute,
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: ROUTES.HOME.name, params: {} },
    },
  ],
});
