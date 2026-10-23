import { expect, test } from '@playwright/test';

import { importCode, toolbarImport } from '../utils/share-code';
import {
  addNewBuildUnit,
  importSquadCode,
  importUnitCode,
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
  COPIED_TOAST,
  IMPORTED_TOAST,
  INVALID_CODE_ERROR,
  OFFICER_BUILD_NAME,
  SERAPH_REPLACED_LINE,
  SNIPER,
  SQUAD_CODE,
  SQUAD_CODE_CALCULATOR_HINT,
  SQUAD_CODE_UNIT_HINT,
  SQUAD_NAME,
  SQUAD_UNIT_COUNT,
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
