import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { PAGE_PATH, PANEL_NAME, RAPID_FIRE } from './persistence.mock';

test.describe('MEC build after a reload', () => {
  test('keeps a selected perk', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, RAPID_FIRE).click();

    const reopened = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);

    await expect(abilityCell(reopened, RAPID_FIRE)).toHaveAttribute('aria-pressed', 'true');
  });
});
