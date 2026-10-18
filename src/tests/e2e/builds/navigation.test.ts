import { expect, test } from '@playwright/test';

import {
  BIOSOLDIER_LINK,
  BIOSOLDIER_PATH,
  BIOSOLDIER_URL,
  BREADCRUMBS,
  BUILDS_CRUMB,
  BUILDS_PATH,
  BUILDS_URL,
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

test.describe('Breadcrumbs', () => {
  test('switch to another calculator', async ({ page }) => {
    await page.goto(BIOSOLDIER_PATH);
    await page.getByRole('navigation', { name: BREADCRUMBS }).getByRole('button', { name: BIOSOLDIER_LINK }).click();

    await page.getByRole('menuitem', { name: MEC_LINK, exact: true }).click();

    await expect(page).toHaveURL(MEC_URL);
  });

  test('lead back to the Build calculator menu', async ({ page }) => {
    await page.goto(BIOSOLDIER_PATH);

    await page.getByRole('navigation', { name: BREADCRUMBS }).getByRole('link', { name: BUILDS_CRUMB, exact: true }).click();

    await expect(page).toHaveURL(BUILDS_URL);
  });
});
