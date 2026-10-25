import type { NavigationHookAfter, RouteLocationNormalized } from 'vue-router';

import { PAGE_HEAD_ATTRIBUTE, pageHeadHtml, resolvePageHead } from '@shared/lib/page-head';

import { PAGE_ROUTES, PAGE_SITE } from '../config/constants';

/**
 * Path of the page the route shows: the path of its deepest matched record, so a trailing slash or a param does
 * not change it. Null before the first navigation, when nothing is matched.
 *
 * @param route current route.
 */
const pagePath = (route: Pick<RouteLocationNormalized, 'matched'>) => route.matched.at(-1)?.path ?? null;

/**
 * Writes the head of the page the router arrived at to the document. Every tag of the previous head is removed
 * first, so a tag the new head lacks, like `noindex` of `404.html`, does not stay. A failed navigation keeps the
 * head of the current page.
 *
 * @param to route the navigation led to.
 * @param _ route the navigation left.
 * @param failure failure of the navigation, if any.
 */
export const applyPageHead: NavigationHookAfter = (to, _, failure) => {
  const path = pagePath(to);

  if (failure || !path) return;

  document.head.querySelectorAll(`[${PAGE_HEAD_ATTRIBUTE}]`).forEach(tag => tag.remove());
  document.head.insertAdjacentHTML('beforeend', pageHeadHtml(resolvePageHead(PAGE_ROUTES, PAGE_SITE, path)));
};
