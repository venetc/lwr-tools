import type { PiniaPluginContext } from 'pinia';
import { createPinia } from 'pinia';
import { createApp, markRaw } from 'vue';

import App from './App.vue';
import { router } from './router';

import './styles/style.scss';
import './styles/fonts/saira.scss';
import './styles/fonts/oxanium.scss';

export const pinia = createPinia();

pinia.use(({ store }: PiniaPluginContext) => {
  store.router = markRaw(router);
});

export const app = createApp(App)
  .use(pinia)
  .use(router);
