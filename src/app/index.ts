import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { BUILD_STORAGE_CODECS_KEY } from '@features/manage-builds';

import App from './App.vue';
import { BUILD_STORAGE_CODECS } from './config/constants';
import { router } from './router';

import './styles/style.scss';
import './styles/fonts/saira.scss';
import './styles/fonts/oxanium.scss';

const pinia = createPinia();

export const app = createApp(App)
  .provide(BUILD_STORAGE_CODECS_KEY, BUILD_STORAGE_CODECS)
  .use(pinia)
  .use(router);
