import { expect, test } from '@playwright/test';

import { importCode, outdatedDialog, toolbarImport } from '../utils/share-code';
import {
  addNewBuildUnit,
  importSquadCode,
  importUnitCode,
  loadoutTile,
  miniTreeStep,
  notifications,
  openAddUnit,
  openSquads,
  savedBuildRow,
  squadItem,
  squadTitle,
  unitCards,
} from '../utils/squads';
import {
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  BROKEN_SQUAD_CODE,
  CANCEL_LABEL,
  CLEARED_STEP,
  COPIED_TOAST,
  IMPORT_LABEL,
  IMPORTED_TOAST,
  INVALID_CODE_ERROR,
  KEPT_STEP,
  OFFICER_BUILD_NAME,
  ONE_OUTDATED_BUILD_SQUAD_CODE,
  OUTDATED_BUILD_NAME,
  OUTDATED_CARD_TEXTS,
  OUTDATED_GROUP_NAMES,
  OUTDATED_SERAPH_REPLACED_LINE,
  OUTDATED_SERAPH_SQUAD_CODE,
  OUTDATED_SQUAD_CODE,
  SERAPH_REPLACED_LINE,
  SHIV,
  SHIV_CLEARED_STEP,
  SHIV_KEPT_STEP,
  SNIPER,
  SQUAD_CODE,
  SQUAD_CODE_CALCULATOR_HINT,
  SQUAD_CODE_UNIT_HINT,
  SQUAD_NAME,
  SQUAD_UNIT_COUNT,
  TACTICAL_VEST_TILE,
  UNIT_CODE,
  UNIT_CODE_HINT,
} from './squad-share-code.mock';

test.describe('Squad Share code', () => {
  test('confirms copying the code with a toast', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'Biosoldier', SNIPER);

    await page.getByRole('main').getByRole('button', { name: 'Share code', exact: true }).click();

    await expect(notifications(page)).toContainText(COPIED_TOAST);
  });
});

test.describe('Squad import in the toolbar', () => {
  test('opens the imported Squad', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, SQUAD_CODE);

    await expect(squadTitle(page)).toHaveValue(SQUAD_NAME);
  });

  test('adds the Squad to the list with all its Units', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, SQUAD_CODE);

    await expect(squadItem(page, SQUAD_NAME, SQUAD_UNIT_COUNT)).toBeVisible();
  });

  test('shows a card for each Unit of a shared Build', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, SQUAD_CODE);

    await expect(unitCards(page, OFFICER_BUILD_NAME)).toHaveCount(2);
  });

  test('gives Units with the same Build one new Build', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, SQUAD_CODE);

    const dialog = await openAddUnit(page);

    await expect(savedBuildRow(dialog, BIOSOLDIER_BUILDS, OFFICER_BUILD_NAME)).toHaveCount(1);
  });

  test('tells how many Builds went to each Build calculator', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, SQUAD_CODE);

    await expect(notifications(page)).toContainText(IMPORTED_TOAST);
  });

  test('brings the Loadouts to the rules with the toast', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, SQUAD_CODE);

    await expect(notifications(page)).toContainText(SERAPH_REPLACED_LINE);
  });

  test('rejects a broken code whole', async ({ page }) => {
    await openSquads(page);

    const dialog = await importSquadCode(page, BROKEN_SQUAD_CODE);

    await expect(dialog.getByRole('alert')).toHaveText(INVALID_CODE_ERROR);
  });

  test('links the error to the field', async ({ page }) => {
    await openSquads(page);

    const dialog = await importSquadCode(page, BROKEN_SQUAD_CODE);

    await expect(dialog.getByRole('textbox', { name: 'Share code' })).toHaveAccessibleDescription(INVALID_CODE_ERROR);
  });

  test('hides the error once the code is edited', async ({ page }) => {
    await openSquads(page);
    const dialog = await importSquadCode(page, BROKEN_SQUAD_CODE);

    await dialog.getByRole('textbox', { name: 'Share code' }).press('x');

    await expect(dialog.getByRole('alert')).toHaveCount(0);
  });

  test('tells to add a Unit code through an empty cell', async ({ page }) => {
    await openSquads(page);

    const dialog = await importSquadCode(page, UNIT_CODE);

    await expect(dialog.getByRole('alert')).toHaveText(UNIT_CODE_HINT);
  });
});

test.describe('Squad import with Outdated selections', () => {
  test('opens the Outdated selections dialog', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await expect(outdatedDialog(page)).toBeVisible();
  });

  test('groups the cards under the Builds that have Outdated selections', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await expect(outdatedDialog(page).getByRole('heading', { level: 3 })).toHaveText(OUTDATED_GROUP_NAMES);
  });

  test('names the Build even if it is the only one with Outdated selections', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, ONE_OUTDATED_BUILD_SQUAD_CODE);

    await expect(outdatedDialog(page).getByRole('heading', { level: 3 })).toHaveText([OUTDATED_BUILD_NAME]);
  });

  test('shows the cards of a Build of two Units once', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await expect(outdatedDialog(page).getByRole('listitem')).toHaveText(OUTDATED_CARD_TEXTS);
  });

  test('keeps the code in the import dialog on Cancel', async ({ page }) => {
    await openSquads(page);
    const dialog = await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(dialog.getByRole('textbox', { name: 'Share code' })).toHaveValue(OUTDATED_SQUAD_CODE);
  });

  test('creates no Squad on Cancel', async ({ page }) => {
    await openSquads(page);
    const dialog = await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();

    await expect(squadItem(page, SQUAD_NAME, SQUAD_UNIT_COUNT)).toHaveCount(0);
  });

  test('keeps the code in the import dialog on Escape', async ({ page }) => {
    await openSquads(page);
    const dialog = await importSquadCode(page, OUTDATED_SQUAD_CODE);
    await outdatedDialog(page).waitFor();

    await page.keyboard.press('Escape');

    await expect(dialog.getByRole('textbox', { name: 'Share code' })).toHaveValue(OUTDATED_SQUAD_CODE);
  });

  test('creates no Squad on Escape', async ({ page }) => {
    await openSquads(page);
    const dialog = await importSquadCode(page, OUTDATED_SQUAD_CODE);
    await outdatedDialog(page).waitFor();

    await page.keyboard.press('Escape');
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();

    await expect(squadItem(page, SQUAD_NAME, SQUAD_UNIT_COUNT)).toHaveCount(0);
  });

  test('keeps the code in the import dialog on Close', async ({ page }) => {
    await openSquads(page);
    const dialog = await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: 'Close', exact: true }).click();

    await expect(dialog.getByRole('textbox', { name: 'Share code' })).toHaveValue(OUTDATED_SQUAD_CODE);
  });

  test('opens the imported Squad on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(squadTitle(page)).toHaveValue(SQUAD_NAME);
  });

  test('shows a card for each Unit of the shared Build on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(unitCards(page, OUTDATED_BUILD_NAME)).toHaveCount(2);
  });

  test('tells how many Builds went to each Build calculator on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(notifications(page)).toContainText(IMPORTED_TOAST);
  });

  test('leaves the outdated steps of a Build empty on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(miniTreeStep(unitCards(page, OUTDATED_BUILD_NAME).first(), CLEARED_STEP)).toBeVisible();
  });

  test('keeps the other selections of a Build on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(miniTreeStep(unitCards(page, OUTDATED_BUILD_NAME).first(), KEPT_STEP)).toBeVisible();
  });

  test('leaves the technology level of a SHIV collision empty on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(miniTreeStep(unitCards(page, SHIV), SHIV_CLEARED_STEP)).toBeVisible();
  });

  test('keeps the other perks of a SHIV build on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(miniTreeStep(unitCards(page, SHIV), SHIV_KEPT_STEP)).toBeVisible();
  });

  test('brings the Loadouts to the cleared Builds on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SERAPH_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(loadoutTile(unitCards(page, OUTDATED_BUILD_NAME), TACTICAL_VEST_TILE)).toBeVisible();
  });

  test('tells what the Unit check took off the cleared Builds on Import', async ({ page }) => {
    await openSquads(page);
    await importSquadCode(page, OUTDATED_SERAPH_SQUAD_CODE);

    await outdatedDialog(page).getByRole('button', { name: IMPORT_LABEL, exact: true }).click();

    await expect(notifications(page)).toContainText(OUTDATED_SERAPH_REPLACED_LINE);
  });

  test('imports a Squad code without Outdated selections without the dialog', async ({ page }) => {
    await openSquads(page);

    await importSquadCode(page, SQUAD_CODE);
    await notifications(page).getByText(IMPORTED_TOAST).waitFor();

    await expect(outdatedDialog(page)).toHaveCount(0);
  });
});

test.describe('Squad code in other places', () => {
  test('Add Unit tells to import it in the toolbar', async ({ page }) => {
    await openSquads(page);

    const dialog = await importUnitCode(page, SQUAD_CODE);

    await expect(dialog.getByRole('alert')).toHaveText(SQUAD_CODE_UNIT_HINT);
  });

  test('a Build calculator tells to import it in the Squad planner', async ({ page }) => {
    await page.goto(BIOSOLDIER_PATH);

    await importCode(page, toolbarImport(page), SQUAD_CODE);

    await expect(notifications(page)).toContainText(SQUAD_CODE_CALCULATOR_HINT);
  });
});
