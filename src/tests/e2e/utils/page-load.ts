import type { Page } from '@playwright/test';

/**
 * Waits until every image of the page has loaded or failed.
 *
 * @description Call it once the content is on the page: images added later are not awaited. Icons still loading when
 * a test ends are missing from its trace snapshots, so the panels in UI mode and reports show empty cells.
 *
 * @param page browser page.
 */
export const waitForImages = async (page: Page) => {
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete));
};
