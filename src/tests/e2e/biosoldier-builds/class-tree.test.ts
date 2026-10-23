import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, addBuild, openBuildPanel } from '../utils/build-panel';
import { LOCK_LABEL, MAGNUM, PAGE_PATH, PANEL_NAME, SHARPSHOOTER } from './class-tree.mock';

/**
 * Opens the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

test.describe('Biosoldier Class tree', () => {
  test('selects a perk on the open rank', async ({ page }) => {
    const panel = await openPanel(page);

    await abilityCell(panel, MAGNUM).click();

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('selects a perk on a rank above empty ones', async ({ page }) => {
    const panel = await openPanel(page);

    await abilityCell(panel, SHARPSHOOTER).click();

    await expect(abilityCell(panel, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'true');
  });

  test('keeps the ranks above when the selected perk of a middle rank is clicked', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).click();
    await abilityCell(panel, SHARPSHOOTER).click();

    await abilityCell(panel, MAGNUM).click();

    await expect(abilityCell(panel, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'true');
  });

  test('clears the rank when its selected perk is clicked', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).click();
    await abilityCell(panel, SHARPSHOOTER).click();

    await abilityCell(panel, MAGNUM).click();

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'false');
  });

  test('does not select a perk on an empty rank of a Read-only build', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('button', { name: LOCK_LABEL }).click();

    await abilityCell(panel, SHARPSHOOTER).click({ force: true });

    await expect(abilityCell(panel, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'false');
  });

  test('leaves another build of the Class untouched', async ({ page }) => {
    const panel = await openPanel(page);
    await addBuild(page, PANEL_NAME);

    await abilityCell(panel, MAGNUM).click();

    await expect(abilityCell(page.getByRole('region', { name: PANEL_NAME }).last(), MAGNUM)).toHaveAttribute('aria-pressed', 'false');
  });
});
