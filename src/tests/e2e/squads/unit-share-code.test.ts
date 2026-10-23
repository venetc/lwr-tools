import { expect, test } from '@playwright/test';

import { importCode, toolbarImport } from '../utils/share-code';
import { addNewBuildUnit, enterUnitCode, importUnitCode, loadoutTile, notifications, openSquads, unitCards } from '../utils/squads';
import {
  BIOSOLDIER_PATH,
  BROKEN_CODE,
  BUILD_CODES,
  COPIED_TOAST,
  INVALID_CODE_ERROR,
  JAEGER,
  JAEGER_BUILD_CODE,
  JAEGER_TOAST,
  OFFICER_BUILD_NAME,
  OFFICER_UNIT_CODE,
  RENAME_LABEL,
  SERAPH_BUILD_NAME,
  SERAPH_REPLACED,
  SERAPH_TILE,
  SERAPH_UNIT_CODE,
  SNIPER,
  SNIPER_RIFLE_TILE,
  TACTICAL_VEST_TILE,
} from './unit-share-code.mock';

test.describe('Unit card Share code', () => {
  test('confirms copying the code with a toast', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'Biosoldier', SNIPER);

    await unitCards(page, SNIPER).getByRole('button', { name: `Copy Share code of ${SNIPER}`, exact: true }).click();

    await expect(notifications(page)).toContainText(COPIED_TOAST);
  });
});

test.describe('Add Unit from a Share code', () => {
  for (const { code, caption } of BUILD_CODES) {
    test(`previews the Unit of a ${caption} Build code`, async ({ page }) => {
      await openSquads(page);

      const dialog = await enterUnitCode(page, code);

      await expect(dialog.getByRole('status', { name: 'Preview' })).toContainText(caption);
    });
  }

  test('adds a Unit of a Build code', async ({ page }) => {
    await openSquads(page);

    await importUnitCode(page, JAEGER_BUILD_CODE);

    await expect(unitCards(page, JAEGER)).toBeVisible();
  });

  test('tells where the Build of the code is added', async ({ page }) => {
    await openSquads(page);

    await importUnitCode(page, JAEGER_BUILD_CODE);

    await expect(notifications(page).getByText(JAEGER_TOAST)).toBeVisible();
  });

  test('adds the Build of the code to its Build calculator', async ({ page }) => {
    await openSquads(page);
    await importUnitCode(page, OFFICER_UNIT_CODE);

    await page.goto(BIOSOLDIER_PATH);

    await expect(page.getByRole('region', { name: SNIPER }).last().getByRole('textbox', { name: RENAME_LABEL })).toHaveValue(OFFICER_BUILD_NAME);
  });

  test('brings the Loadout of a Unit code', async ({ page }) => {
    await openSquads(page);

    await importUnitCode(page, OFFICER_UNIT_CODE);

    await expect(loadoutTile(unitCards(page, OFFICER_BUILD_NAME), SNIPER_RIFLE_TILE)).toBeVisible();
  });

  test('keeps Seraph Armor of an Officer by the officer perks of the Build', async ({ page }) => {
    await openSquads(page);

    await importUnitCode(page, OFFICER_UNIT_CODE);

    await expect(loadoutTile(unitCards(page, OFFICER_BUILD_NAME), SERAPH_TILE)).toBeVisible();
  });

  test('brings a Loadout that breaks the rules to them with a toast', async ({ page }) => {
    await openSquads(page);

    await importUnitCode(page, SERAPH_UNIT_CODE);

    await expect(notifications(page)).toContainText(SERAPH_REPLACED);
  });

  test('replaces Seraph Armor of a Unit without officer perks with the default armor', async ({ page }) => {
    await openSquads(page);

    await importUnitCode(page, SERAPH_UNIT_CODE);

    await expect(loadoutTile(unitCards(page, SERAPH_BUILD_NAME), TACTICAL_VEST_TILE)).toBeVisible();
  });

  test('shows an error for a broken code', async ({ page }) => {
    await openSquads(page);

    const dialog = await importUnitCode(page, BROKEN_CODE);

    await expect(dialog.getByRole('alert')).toHaveText(INVALID_CODE_ERROR);
  });

  test('links the error to the field', async ({ page }) => {
    await openSquads(page);

    const dialog = await importUnitCode(page, BROKEN_CODE);

    await expect(dialog.getByRole('textbox', { name: 'Share code' })).toHaveAccessibleDescription(INVALID_CODE_ERROR);
  });

  test('hides the error once the code is edited', async ({ page }) => {
    await openSquads(page);
    const dialog = await importUnitCode(page, BROKEN_CODE);

    await dialog.getByRole('textbox', { name: 'Share code' }).press('x');

    await expect(dialog.getByRole('alert')).toHaveCount(0);
  });
});

test.describe('Unit code in a Build calculator', () => {
  test('imports as a build', async ({ page }) => {
    await page.goto(BIOSOLDIER_PATH);

    await importCode(page, toolbarImport(page), OFFICER_UNIT_CODE);

    await expect(page.getByRole('region', { name: SNIPER }).last().getByRole('textbox', { name: RENAME_LABEL })).toHaveValue(OFFICER_BUILD_NAME);
  });
});
