import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import {
  BIOSOLDIER_LINK,
  BIOSOLDIER_TITLE,
  BIOSOLDIER_URL,
  BUILDS_LINK,
  BUILDS_URL,
  ROOT_PATH,
  ROOT_TITLE,
  ROOT_URL,
} from './page-head.mock';

/**
 * Goes from the home page to the Biosoldier calculator through the menus, without reloading the page, waiting for
 * each navigation to end.
 *
 * @param page browser page.
 */
const openBiosoldierFromHome = async (page: Page) => {
  await page.goto(ROOT_PATH);
  await page.getByRole('main').getByRole('link', { name: BUILDS_LINK, exact: true }).click();
  await page.waitForURL(BUILDS_URL);
  await page.getByRole('main').getByRole('link', { name: BIOSOLDIER_LINK, exact: true }).click();
  await page.waitForURL(BIOSOLDIER_URL);
};

/**
 * Goes from the Biosoldier calculator back to the home page through the browser history, waiting for each step.
 *
 * @param page browser page.
 */
const returnHome = async (page: Page) => {
  await page.goBack();
  await page.waitForURL(BUILDS_URL);
  await page.goBack();
  await page.waitForURL(ROOT_URL);
};

test.describe('Home head', () => {
  test('titles the tab', async ({ page }) => {
    await page.goto(ROOT_PATH);

    await expect(page).toHaveTitle(ROOT_TITLE);
  });
});

test.describe('Head after navigation', () => {
  test('titles the tab of the calculator', async ({ page }) => {
    await openBiosoldierFromHome(page);

    await expect(page).toHaveTitle(BIOSOLDIER_TITLE);
  });

  test('titles the tab of the home page again on return', async ({ page }) => {
    await openBiosoldierFromHome(page);

    await returnHome(page);

    await expect(page).toHaveTitle(ROOT_TITLE);
  });
});
