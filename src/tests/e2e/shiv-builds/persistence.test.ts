import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { HOLO_ROUNDS, PAGE_PATH, PANEL_NAME } from './persistence.mock';

test.describe('SHIV build after a reload', () => {
  test('keeps a selected perk', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, HOLO_ROUNDS).click();

    const reopened = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);

    await expect(abilityCell(reopened, HOLO_ROUNDS)).toHaveAttribute('aria-pressed', 'true');
  });
});
