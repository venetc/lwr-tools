import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { resolvePageHead } from '@shared/lib/page-head';

import { PAGE_ROUTES, PAGE_SITE } from '../config/constants';
import { pagePath } from './page-head';

/**
 * Lead paragraph of the current page: the description of its head. Null until the first navigation ends.
 */
export const usePageLead = () => {
  const route = useRoute();

  const lead = computed(() => {
    const path = pagePath(route);

    if (!path) return null;

    return resolvePageHead(PAGE_ROUTES, PAGE_SITE, path).description;
  });

  return { lead };
};
