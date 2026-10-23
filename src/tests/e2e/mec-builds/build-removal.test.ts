import { expect, test } from '@playwright/test';

import { buildRemovalDialog, openBuildPanel, removeBuild } from '../utils/build-panel';
import { openSquads, seedSquads, squadItem } from '../utils/squads';
import { ALPHA, BUILD_NAME, CANCEL_LABEL, DELETE_LABEL, NOTE, PAGE_PATH, SQUADS } from './build-removal.mock';

test.describe('MEC build removal', () => {
  test('removes a build in no Squad at once', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, BUILD_NAME);

    await removeBuild(panel);

    await expect(page.getByRole('region', { name: BUILD_NAME })).toHaveCount(0);
  });

  test('asks before removing a build in Squads', async ({ page }) => {
    await seedSquads(page, SQUADS);
    const panel = await openBuildPanel(page, PAGE_PATH, BUILD_NAME);

    await removeBuild(panel);

    await expect(buildRemovalDialog(page, BUILD_NAME)).toBeVisible();
  });

  test('lists the Squads with the number of Units in the dialog', async ({ page }) => {
    await seedSquads(page, SQUADS);
    const panel = await openBuildPanel(page, PAGE_PATH, BUILD_NAME);

    await removeBuild(panel);

    await expect(buildRemovalDialog(page, BUILD_NAME).getByText(NOTE, { exact: true })).toBeVisible();
  });

  test('keeps the build on Cancel', async ({ page }) => {
    await seedSquads(page, SQUADS);
    const panel = await openBuildPanel(page, PAGE_PATH, BUILD_NAME);
    await removeBuild(panel);

    await buildRemovalDialog(page, BUILD_NAME).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(page.getByRole('region', { name: BUILD_NAME })).toHaveCount(1);
  });

  test('keeps the Units on Cancel', async ({ page }) => {
    await seedSquads(page, SQUADS);
    const panel = await openBuildPanel(page, PAGE_PATH, BUILD_NAME);
    await removeBuild(panel);
    await buildRemovalDialog(page, BUILD_NAME).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await openSquads(page);

    await expect(squadItem(page, ALPHA, 2)).toBeVisible();
  });

  test('removes the build on Delete', async ({ page }) => {
    await seedSquads(page, SQUADS);
    const panel = await openBuildPanel(page, PAGE_PATH, BUILD_NAME);
    await removeBuild(panel);

    await buildRemovalDialog(page, BUILD_NAME).getByRole('button', { name: DELETE_LABEL, exact: true }).click();

    await expect(page.getByRole('region', { name: BUILD_NAME })).toHaveCount(0);
  });

  test('removes the Units of the build on Delete', async ({ page }) => {
    await seedSquads(page, SQUADS);
    const panel = await openBuildPanel(page, PAGE_PATH, BUILD_NAME);
    await removeBuild(panel);
    await buildRemovalDialog(page, BUILD_NAME).getByRole('button', { name: DELETE_LABEL, exact: true }).click();

    await openSquads(page);

    await expect(squadItem(page, ALPHA, 0)).toBeVisible();
  });
});
