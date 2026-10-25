import { expect, test } from '@playwright/test';

import { PAGE_LEAD, PAGE_PATH, PAGE_TITLE } from './page-head.mock';

test.describe('Biosoldier Build calculator head', () => {
  test('titles the tab', async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(page).toHaveTitle(PAGE_TITLE);
  });

  test('shows the lead paragraph', async ({ page }) => {
    await page.goto(PAGE_PATH);

    await expect(page.getByText(PAGE_LEAD, { exact: true })).toBeVisible();
  });
});
