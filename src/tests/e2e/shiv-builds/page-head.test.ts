import { expect, test } from '@playwright/test';

import { PAGE_PATH, PAGE_TITLE } from './page-head.mock';

test.describe('SHIV Build calculator head', () => {
  test('titles the tab', async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(page).toHaveTitle(PAGE_TITLE);
  });
});
