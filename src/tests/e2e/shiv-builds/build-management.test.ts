import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel, resetBuild } from '../utils/build-panel';
import { ADD_LABEL, HOLO_ROUNDS, PAGE_PATH, PANEL_NAME } from './build-management.mock';

test.describe('SHIV Build management', () => {
  test('adds a build with the add button', async ({ page }) => {
    await openBuildPanel(page, PAGE_PATH, PANEL_NAME);

    await page.getByRole('main').getByRole('button', { name: ADD_LABEL, exact: true }).click();

    await expect(page.getByRole('region', { name: PANEL_NAME })).toHaveCount(2);
  });

  test('clears the selected perks on reset', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, HOLO_ROUNDS).click();

    await resetBuild(panel);

    await expect(abilityCell(panel, HOLO_ROUNDS)).toHaveAttribute('aria-pressed', 'false');
  });
});
