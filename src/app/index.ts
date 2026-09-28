import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';

import './styles/style.scss';
import './styles/fonts/saira.scss';
import './styles/fonts/oxanium.scss';

const pinia = createPinia();

export const app = createApp(App)
  .use(pinia)
  .use(router);
