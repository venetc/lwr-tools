import { expect, test } from '@playwright/test';

import {
  BIOSOLDIER_LINK,
  BIOSOLDIER_URL,
  BUILDS_PATH,
  MEC_LINK,
  MEC_URL,
  SHIV_LINK,
  SHIV_URL,
} from './navigation.mock';

test.describe('Build calculator menu', () => {
  test('leads to the Biosoldier calculator', async ({ page }) => {
    await page.goto(BUILDS_PATH);

    await page.getByRole('main').getByRole('link', { name: BIOSOLDIER_LINK, exact: true }).click();

    await expect(page).toHaveURL(BIOSOLDIER_URL);
  });

  test('leads to the MEC calculator', async ({ page }) => {
    await page.goto(BUILDS_PATH);

    await page.getByRole('main').getByRole('link', { name: MEC_LINK, exact: true }).click();

    await expect(page).toHaveURL(MEC_URL);
  });

  test('leads to the SHIV calculator', async ({ page }) => {
    await page.goto(BUILDS_PATH);

    await page.getByRole('main').getByRole('link', { name: SHIV_LINK, exact: true }).click();

    await expect(page).toHaveURL(SHIV_URL);
  });
});
