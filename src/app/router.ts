import type { Router } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'talents' },
    },
    {
      path: '/talents/',
      name: 'talents',
      component: () => import('@pages/talents').then(talentsPageModule => talentsPageModule.TalentsPage),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});
