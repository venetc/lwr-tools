import type { PiniaPluginContext } from 'pinia';
import type { Router } from 'vue-router';
import { createPinia } from 'pinia';
import { createApp, markRaw } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';

import './style.css';
import './fonts/inter.scss';
import './fonts/oxanium.scss';

export const pinia = createPinia();

export const router: Router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: () => import('./components/HomeView.vue'),
      },
    },
    {
      path: '/about',
      name: 'About',
      components: {
        default: () => import('./components/AboutView.vue'),
      },
    },
  ],
});

pinia.use(({ store }: PiniaPluginContext) => {
  store.router = markRaw(router);
});

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app');
