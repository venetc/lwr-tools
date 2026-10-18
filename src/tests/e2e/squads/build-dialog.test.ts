import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { addSavedUnit, miniTreeStep, openBuildDialog, openSquads, unitCards } from '../utils/squads';
import {
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  JAEGER,
  MAGNUM,
  MAGNUM_STEP,
  MEC_BUILDS,
  REMOVE_LABEL,
  RENAME_LABEL,
  RENAMED_SNIPER,
  SHIV,
  SHIV_BUILDS,
  SNIPER,
} from './build-dialog.mock';

test.describe('Build dialog', () => {
  test('shows the tree of a biosoldier build', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);

    await expect(dialog.getByRole('region', { name: SNIPER })).toBeVisible();
  });

  test('shows the tree of a MEC build', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    const dialog = await openBuildDialog(page, unitCards(page, JAEGER), JAEGER);

    await expect(dialog.getByRole('region', { name: JAEGER })).toBeVisible();
  });

  test('shows the tree of a SHIV build', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);

    const dialog = await openBuildDialog(page, unitCards(page, SHIV), SHIV);

    await expect(dialog.getByRole('region', { name: SHIV })).toBeVisible();
  });

  test('offers no removal of the build', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);

    await expect(dialog.getByRole('button', { name: REMOVE_LABEL })).toHaveCount(0);
  });

  test('shows a perk selected in the dialog on the card', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await abilityCell(dialog, MAGNUM).click();

    await page.keyboard.press('Escape');

    await expect(miniTreeStep(unitCards(page, SNIPER), MAGNUM_STEP)).toBeVisible();
  });

  test('keeps a perk selected in the dialog in the Build calculator', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await abilityCell(dialog, MAGNUM).click();

    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('shows a name given in the dialog on the card', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await dialog.getByRole('textbox', { name: RENAME_LABEL }).fill(RENAMED_SNIPER);
    await dialog.getByRole('textbox', { name: RENAME_LABEL }).press('Enter');

    await page.keyboard.press('Escape');

    await expect(unitCards(page, RENAMED_SNIPER)).toBeVisible();
  });

  test('keeps a name given in the dialog in the Build calculator', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await dialog.getByRole('textbox', { name: RENAME_LABEL }).fill(RENAMED_SNIPER);
    await dialog.getByRole('textbox', { name: RENAME_LABEL }).press('Enter');

    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);

    await expect(panel.getByRole('textbox', { name: RENAME_LABEL })).toHaveValue(RENAMED_SNIPER);
  });

  test('restores the Class name of a name left blank when the dialog closes', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await dialog.getByRole('textbox', { name: RENAME_LABEL }).fill('');

    await page.keyboard.press('Escape');

    await expect(unitCards(page, SNIPER)).toBeVisible();
  });
});
