import type { RouterScrollBehavior } from 'vue-router';

/**
 * Scroll of the window after a navigation: Back and Forward return the position the page was left at, any other
 * navigation opens the page at the top.
 *
 * @param _to route the navigation leads to.
 * @param _from route the navigation leaves.
 * @param savedPosition position saved for the entry, given only on Back and Forward.
 */
export const scrollBehavior: RouterScrollBehavior = (_to, _from, savedPosition) => savedPosition ?? { top: 0 };
