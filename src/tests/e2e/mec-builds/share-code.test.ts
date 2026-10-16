import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { exportCode, importCode, toolbarImport } from '../utils/share-code';
import { PAGE_PATH, PANEL_NAME, RAPID_FIRE } from './share-code.mock';

test.describe('MEC build imported from its Share code', () => {
  test('has the selected perks', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, RAPID_FIRE).click();
    const code = await exportCode(page, panel);

    await importCode(page, toolbarImport(page), code);

    await expect(abilityCell(page.getByRole('region', { name: PANEL_NAME }).last(), RAPID_FIRE)).toHaveAttribute('aria-pressed', 'true');
  });
});
