import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { exportCode, importCode, outdatedDialog, toolbarImport } from '../utils/share-code';
import {
  CANCEL_LABEL,
  CODE_LABEL,
  COLLISION_BUILD_CODE,
  COLLISION_CARD_TEXT,
  COLLISION_UNIT_CODE,
  HOLO_ROUNDS,
  IMPORT_LABEL,
  LOCK_N_LOAD,
  PAGE_PATH,
  PANEL_NAME,
} from './share-code.mock';

/**
 * Builds of the SHIV Build calculator.
 *
 * @param page browser page.
 */
const shivPanels = (page: Page) => page.getByRole('region', { name: PANEL_NAME });

/**
 * Opens the SHIV Build calculator and enters the code in the import form of the toolbar.
 *
 * @param page browser page.
 * @param code Share code.
 */
const importInCalculator = async (page: Page, code: string) => {
  await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
  await importCode(page, toolbarImport(page), code);
};

test.describe('SHIV build imported from its Share code', () => {
  test('has the selected perks', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, HOLO_ROUNDS).click();
    const code = await exportCode(page, panel);

    await importCode(page, toolbarImport(page), code);

    await expect(abilityCell(shivPanels(page).last(), HOLO_ROUNDS)).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('SHIV Share code with Outdated selections', () => {
  test('opens the Outdated selections dialog for a build code', async ({ page }) => {
    await importInCalculator(page, COLLISION_BUILD_CODE);

    await expect(outdatedDialog(page)).toBeVisible();
  });

  test('opens the Outdated selections dialog for a Unit code', async ({ page }) => {
    await importInCalculator(page, COLLISION_UNIT_CODE);

    await expect(outdatedDialog(page)).toBeVisible();
  });

  test('shows both perks of a technology level on one card', async ({ page }) => {
    await importInCalculator(page, COLLISION_BUILD_CODE);

    await expect(outdatedDialog(page).getByRole('listitem')).toHaveText(COLLISION_CARD_TEXT);
  });

  test('keeps the code in the import form on Cancel', async ({ page }) => {
    await importInCalculator(page, COLLISION_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(page.getByRole('textbox', { name: CODE_LABEL })).toHaveValue(COLLISION_BUILD_CODE);
  });

  test('adds no build on Cancel', async ({ page }) => {
    await importInCalculator(page, COLLISION_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(shivPanels(page)).toHaveCount(1);
  });

  test('adds the build with the other perks on Import', async ({ page }) => {
    await importInCalculator(page, COLLISION_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(abilityCell(shivPanels(page).last(), HOLO_ROUNDS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('adds the build without the Outdated selections on Import', async ({ page }) => {
    await importInCalculator(page, COLLISION_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(abilityCell(shivPanels(page).last(), LOCK_N_LOAD)).toHaveAttribute('aria-pressed', 'false');
  });

  test('closes the import form on Import', async ({ page }) => {
    await importInCalculator(page, COLLISION_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(page.getByRole('textbox', { name: CODE_LABEL })).toBeHidden();
  });
});
