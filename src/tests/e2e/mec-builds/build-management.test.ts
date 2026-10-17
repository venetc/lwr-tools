import { expect, test } from '@playwright/test';

import { abilityCell, addBuild, openBuildPanel } from '../utils/build-panel';
import { ADDED_CLASS, PAGE_PATH, PANEL_NAME, RAPID_FIRE, RESET_LABEL } from './build-management.mock';

test.describe('MEC Build management', () => {
  test('adds a build of the Class chosen in the add menu', async ({ page }) => {
    await openBuildPanel(page, PAGE_PATH, PANEL_NAME);

    await addBuild(page, ADDED_CLASS);

    await expect(page.getByRole('region', { name: ADDED_CLASS })).toHaveCount(2);
  });

  test('clears the selected perks on reset', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, RAPID_FIRE).click();

    await panel.getByRole('button', { name: RESET_LABEL }).click();

    await expect(abilityCell(panel, RAPID_FIRE)).toHaveAttribute('aria-pressed', 'false');
  });
});
