import type { RouteRecordRaw } from 'vue-router';

export const RECORDS: RouteRecordRaw[] = [
  { path: '/first', redirect: '/', meta: { title: 'First' } },
  { path: '/untitled', redirect: '/' },
  { path: '/second', redirect: '/', meta: { title: 'Second' } },
];

export const TITLED_LABELS = ['First', 'Second'];

export const TITLED_PATHS = ['/first', '/second'];
