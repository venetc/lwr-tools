import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { exportCode, importCode, outdatedDialog, toolbarImport } from '../utils/share-code';
import {
  CANCEL_LABEL,
  CODE_LABEL,
  IMPORT_LABEL,
  LONE_WOLF,
  OUTDATED_BUILD_CODE,
  OUTDATED_CARD_TEXT,
  OUTDATED_UNIT_CODE,
  PAGE_PATH,
  PANEL_NAME,
  RAPID_FIRE,
  REPLACE_LABEL,
  SHARPSHOOTER,
} from './share-code.mock';

/**
 * Builds of the tested Class.
 *
 * @param page browser page.
 */
const classPanels = (page: Page) => page.getByRole('region', { name: PANEL_NAME });

/**
 * Opens the MEC Build calculator and enters the code in the import form of the toolbar.
 *
 * @param page browser page.
 * @param code Share code.
 */
const importInCalculator = async (page: Page, code: string) => {
  await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
  await importCode(page, toolbarImport(page), code);
};

test.describe('MEC build imported from its Share code', () => {
  test('has the selected perks', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, RAPID_FIRE).click();
    const code = await exportCode(page, panel);

    await importCode(page, toolbarImport(page), code);

    await expect(abilityCell(classPanels(page).last(), RAPID_FIRE)).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('MEC Share code with Outdated selections', () => {
  test('opens the Outdated selections dialog for a build code', async ({ page }) => {
    await importInCalculator(page, OUTDATED_BUILD_CODE);

    await expect(outdatedDialog(page)).toBeVisible();
  });

  test('opens the Outdated selections dialog for a Unit code', async ({ page }) => {
    await importInCalculator(page, OUTDATED_UNIT_CODE);

    await expect(outdatedDialog(page)).toBeVisible();
  });

  test('shows a card for the rank', async ({ page }) => {
    await importInCalculator(page, OUTDATED_BUILD_CODE);

    await expect(outdatedDialog(page).getByRole('listitem')).toHaveText([OUTDATED_CARD_TEXT]);
  });

  test('keeps the code in the import form on Cancel', async ({ page }) => {
    await importInCalculator(page, OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(page.getByRole('textbox', { name: CODE_LABEL })).toHaveValue(OUTDATED_BUILD_CODE);
  });

  test('adds no build on Cancel', async ({ page }) => {
    await importInCalculator(page, OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(classPanels(page)).toHaveCount(1);
  });

  test('adds the build with the other perks on Import', async ({ page }) => {
    await importInCalculator(page, OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(abilityCell(classPanels(page).last(), LONE_WOLF)).toHaveAttribute('aria-pressed', 'true');
  });

  test('adds the build without the Outdated selections on Import', async ({ page }) => {
    await importInCalculator(page, OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(abilityCell(classPanels(page).last(), SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'false');
  });

  test('closes the import form on Import', async ({ page }) => {
    await importInCalculator(page, OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(page.getByRole('textbox', { name: CODE_LABEL })).toBeHidden();
  });
});

test.describe('MEC build replaced with a Share code with Outdated selections', () => {
  test('opens the Outdated selections dialog', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);

    await importCode(page, panel.getByRole('button', { name: REPLACE_LABEL }), OUTDATED_BUILD_CODE);

    await expect(outdatedDialog(page)).toBeVisible();
  });

  test('keeps the build on Cancel', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, RAPID_FIRE).click();
    await importCode(page, panel.getByRole('button', { name: REPLACE_LABEL }), OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(abilityCell(panel, RAPID_FIRE)).toHaveAttribute('aria-pressed', 'true');
  });

  test('takes the other perks of the code on Import', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await importCode(page, panel.getByRole('button', { name: REPLACE_LABEL }), OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(abilityCell(panel, LONE_WOLF)).toHaveAttribute('aria-pressed', 'true');
  });

  test('leaves the outdated rank empty on Import', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await abilityCell(panel, RAPID_FIRE).click();
    await importCode(page, panel.getByRole('button', { name: REPLACE_LABEL }), OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(abilityCell(panel, RAPID_FIRE)).toHaveAttribute('aria-pressed', 'false');
  });

  test('adds no build on Import', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await importCode(page, panel.getByRole('button', { name: REPLACE_LABEL }), OUTDATED_BUILD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(classPanels(page)).toHaveCount(1);
  });
});
