import { expect, test } from '@playwright/test';

import {
  BREADCRUMBS,
  BUILDS_LINK,
  BUILDS_URL,
  ROOT_CRUMB,
  ROOT_PATH,
  ROOT_URL,
  SQUADS_LINK,
  SQUADS_PATH,
  SQUADS_URL,
  UNKNOWN_PATH,
} from './navigation.mock';

test.describe('Home menu', () => {
  test('stays on the root', async ({ page }) => {
    await page.goto(ROOT_PATH);

    await expect(page.getByRole('main').getByRole('link', { name: SQUADS_LINK, exact: true })).toBeVisible();
  });

  test('leads to the Build calculator menu', async ({ page }) => {
    await page.goto(ROOT_PATH);

    await page.getByRole('main').getByRole('link', { name: BUILDS_LINK, exact: true }).click();

    await expect(page).toHaveURL(BUILDS_URL);
  });

  test('leads to the Squad planner', async ({ page }) => {
    await page.goto(ROOT_PATH);

    await page.getByRole('main').getByRole('link', { name: SQUADS_LINK, exact: true }).click();

    await expect(page).toHaveURL(SQUADS_URL);
  });

  test('is where an unknown path leads', async ({ page }) => {
    await page.goto(UNKNOWN_PATH);

    await expect(page).toHaveURL(ROOT_URL);
  });
});

test.describe('Squad planner breadcrumbs', () => {
  test('start with the menu of the tools', async ({ page }) => {
    await page.goto(SQUADS_PATH);
    await page.getByRole('navigation', { name: BREADCRUMBS }).getByRole('button', { name: ROOT_CRUMB, exact: true }).click();

    await page.getByRole('menuitem', { name: BUILDS_LINK, exact: true }).click();

    await expect(page).toHaveURL(BUILDS_URL);
  });
});
