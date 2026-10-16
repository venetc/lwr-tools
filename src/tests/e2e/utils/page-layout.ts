import type { Page } from '@playwright/test';

/**
 * How far the page content sticks out of the viewport sideways, in pixels; zero or less means no horizontal scroll.
 *
 * @param page browser page.
 */
export const pageOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
