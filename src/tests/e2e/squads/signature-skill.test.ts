import { expect, test } from '@playwright/test';

import { openBuildPanel, selectSignatureSkill } from '../utils/build-panel';
import { addSavedUnit, openBuildDialog, openSquads, unitCards } from '../utils/squads';
import { BIOSOLDIER_BUILDS, BIOSOLDIER_PATH, LONE_WOLF, LONE_WOLF_LABEL, SNIPER } from './signature-skill.mock';

test.describe('Signature skill in the Build dialog', () => {
  test('is set in the dialog', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);

    await selectSignatureSkill(page, dialog, LONE_WOLF);

    await expect(dialog.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeVisible();
  });

  test('is kept in the Build calculator', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await selectSignatureSkill(page, dialog, LONE_WOLF);

    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);

    await expect(panel.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeVisible();
  });
});
