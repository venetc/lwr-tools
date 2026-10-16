import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { FORTIFIED, HOLO_ROUNDS, PAGE_PATH, PANEL_NAME } from './shiv-tree.mock';

/**
 * Opens the SHIV Build calculator and returns the panel of the default build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

test.describe('SHIV tree', () => {
  test('selects a perk', async ({ page }) => {
    const panel = await openPanel(page);

    await abilityCell(panel, HOLO_ROUNDS).click();

    await expect(abilityCell(panel, HOLO_ROUNDS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('clears a technology level when the selected perk is clicked', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, HOLO_ROUNDS).click();

    await abilityCell(panel, HOLO_ROUNDS).click();

    await expect(abilityCell(panel, HOLO_ROUNDS)).toHaveAttribute('aria-pressed', 'false');
  });

  test('selects a perk on any technology level regardless of the others', async ({ page }) => {
    const panel = await openPanel(page);

    await abilityCell(panel, FORTIFIED).click();

    await expect(abilityCell(panel, FORTIFIED)).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('SHIV build panel', () => {
  test('has no tabs', async ({ page }) => {
    const panel = await openPanel(page);

    const tablist = panel.getByRole('tablist');

    await expect(tablist).toHaveCount(0);
  });
});
