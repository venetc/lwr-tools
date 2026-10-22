import type { Page } from '@playwright/test';

/**
 * Hides or shows the tab as switching between tabs does: sets the visibility of the document for the listeners of
 * `visibilitychange` and fires it. Browsers under test keep every tab visible, so the switch is played out in the page;
 * the document reports its real visibility again once the listeners have run.
 *
 * @param page browser page.
 * @param visibilityState visibility the tab gets.
 */
export const setTabVisibility = (page: Page, visibilityState: 'hidden' | 'visible') => page.evaluate((state) => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
  Reflect.deleteProperty(document, 'visibilityState');
}, visibilityState);
