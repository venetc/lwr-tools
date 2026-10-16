import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { PAGE_PATH, PANEL_NAME, RAPID_FIRE, SHARPSHOOTER } from './class-tree.mock';

/**
 * Opens the MEC Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

test.describe('MEC Class tree', () => {
  test('selects a perk on the open rank', async ({ page }) => {
    const panel = await openPanel(page);

    await abilityCell(panel, RAPID_FIRE).click();

    await expect(abilityCell(panel, RAPID_FIRE)).toHaveAttribute('aria-pressed', 'true');
  });

  test('clears the ranks above when the selected perk is clicked', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, RAPID_FIRE).click();
    await abilityCell(panel, SHARPSHOOTER).click();

    await abilityCell(panel, RAPID_FIRE).click();

    await expect(abilityCell(panel, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'false');
  });

  test('does not select a perk on a locked rank', async ({ page }) => {
    const panel = await openPanel(page);

    await abilityCell(panel, SHARPSHOOTER).click({ force: true });

    await expect(abilityCell(panel, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('MEC build panel', () => {
  test('has no tabs', async ({ page }) => {
    const panel = await openPanel(page);

    const tablist = panel.getByRole('tablist');

    await expect(tablist).toHaveCount(0);
  });
});
