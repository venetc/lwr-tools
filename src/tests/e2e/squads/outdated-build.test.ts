import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openBuildPanel } from '../utils/build-panel';
import { seedBuilds } from '../utils/build-storage';
import type { SeededUnit } from '../utils/squads';
import {
  loadoutTile,
  miniTreeStep,
  notifications,
  openAddUnit,
  openBuildDialog,
  openSquads,
  savedBuildRow,
  seedSquad,
  unitCards,
} from '../utils/squads';
import {
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  BIOSOLDIER_STORAGE_PREFIX,
  CLEARED_STEP,
  JAEGER,
  JAEGER_OUTDATED_STEP,
  JAEGER_UNIT,
  LOADOUT_DIALOG,
  LONE_WOLF_STEP,
  MEC_STORAGE_PREFIX,
  OUTDATED_CAPTION,
  OUTDATED_JAEGER_BUILD,
  OUTDATED_SHIV_BUILD,
  OUTDATED_SNIPER_BUILD,
  OUTDATED_UPDATE_LABEL,
  SEEDED_SQUAD_KEY,
  SERAPH_ARMOR_CODE,
  SERAPH_REPLACED,
  SERAPH_SNIPER,
  SERAPH_TILE,
  SHIV,
  SHIV_OUTDATED_STEP,
  SHIV_STORAGE_PREFIX,
  SHIV_UNIT,
  SNIPER,
  SNIPER_CAPTION,
  SNIPER_OUTDATED_STEP,
  SQUAD_BLOCK_TEXT,
  SQUAD_BLOCK_TITLE,
  SQUAD_CODE_LABEL,
  TACTICAL_VEST_TILE,
  TOAST_TITLE,
  UNIT_BLOCK_TEXT,
  UNIT_BLOCK_TITLE,
  UPDATE_DIALOG,
  UPDATE_HINT,
  UPDATE_LABEL,
} from './outdated-build.mock';

/**
 * Seeds the Outdated builds of every Build calculator and a Squad with the Units, then opens the Squad planner.
 *
 * @param page browser page.
 * @param units Units of the Squad.
 */
const openSeededSquad = async (page: Page, units: SeededUnit[]) => {
  await seedBuilds(page, BIOSOLDIER_STORAGE_PREFIX, [OUTDATED_SNIPER_BUILD]);
  await seedBuilds(page, MEC_STORAGE_PREFIX, [OUTDATED_JAEGER_BUILD]);
  await seedBuilds(page, SHIV_STORAGE_PREFIX, [OUTDATED_SHIV_BUILD]);
  await seedSquad(page, units);
  await openSquads(page);
};

/**
 * Units the seeded Squad keeps in the local storage.
 *
 * @param page browser page.
 */
const storedUnits = (page: Page) => page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? '{}').units, SEEDED_SQUAD_KEY);

/**
 * Toast of the Unit check.
 *
 * @param page browser page.
 */
const unitCheckToast = (page: Page) => notifications(page).getByRole('listitem').filter({ hasText: TOAST_TITLE });

/**
 * Confirms the «Update build» dialog opened from a build panel.
 *
 * @param page browser page.
 */
const confirmUpdate = (page: Page) => page.getByRole('dialog', { name: UPDATE_DIALOG }).getByRole('button', { name: UPDATE_LABEL, exact: true }).click();

test.describe('Unit of an Outdated build', () => {
  test('stays in the Squad with the Outdated build line under its name', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await expect(unitCards(page, SNIPER)).toContainText(OUTDATED_CAPTION);
  });

  test('keeps a Loadout the Unit check would change', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await expect(loadoutTile(unitCards(page, SNIPER), SERAPH_TILE)).toBeVisible();
  });

  test('keeps the stored Loadout', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await expect.poll(async () => (await storedUnits(page))[0].loadout.armor).toBe(SERAPH_ARMOR_CODE);
  });

  test('has its Loadout frozen', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await expect(loadoutTile(unitCards(page, SNIPER), SERAPH_TILE)).toHaveAttribute('aria-disabled', 'true');
  });

  test('opens no Loadout dialog from a tile', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await loadoutTile(unitCards(page, SNIPER), SERAPH_TILE).click({ force: true });

    await expect(page.getByRole('dialog', { name: LOADOUT_DIALOG })).toHaveCount(0);
  });

  test('is not told by the Unit check', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);
    await loadoutTile(unitCards(page, SNIPER), SERAPH_TILE).waitFor();

    await expect(unitCheckToast(page)).toHaveCount(0);
  });
});

test.describe('Mini-tree of an Outdated build', () => {
  test('marks the outdated perk of a biosoldier', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await expect(miniTreeStep(unitCards(page, SNIPER), SNIPER_OUTDATED_STEP)).toBeVisible();
  });

  test('keeps the selections of the code that fit', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await expect(miniTreeStep(unitCards(page, SNIPER), LONE_WOLF_STEP)).toBeVisible();
  });

  test('marks the outdated perk of a MEC', async ({ page }) => {
    await openSeededSquad(page, [JAEGER_UNIT]);

    await expect(miniTreeStep(unitCards(page, JAEGER), JAEGER_OUTDATED_STEP)).toBeVisible();
  });

  test('marks both perks of a SHIV collision', async ({ page }) => {
    await openSeededSquad(page, [SHIV_UNIT]);

    await expect(miniTreeStep(unitCards(page, SHIV), SHIV_OUTDATED_STEP)).toBeVisible();
  });
});

test.describe('Add Unit with an Outdated build', () => {
  test('disables the row of the Outdated build', async ({ page }) => {
    await openSeededSquad(page, []);

    const dialog = await openAddUnit(page);

    await expect(savedBuildRow(dialog, BIOSOLDIER_BUILDS, SNIPER)).toBeDisabled();
  });

  test('hints to update the build first', async ({ page }) => {
    await openSeededSquad(page, []);

    const dialog = await openAddUnit(page);

    await expect(savedBuildRow(dialog, BIOSOLDIER_BUILDS, SNIPER)).toContainText(UPDATE_HINT);
  });
});

test.describe('Share code with an Outdated build', () => {
  test('of a Unit is not copied and tells why', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await unitCards(page, SNIPER).getByRole('button', { name: `Copy Share code of ${SNIPER}`, exact: true }).click();

    await expect(notifications(page).getByText(UNIT_BLOCK_TEXT)).toBeVisible();
  });

  test('of a Unit is told as not copied', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    await unitCards(page, SNIPER).getByRole('button', { name: `Copy Share code of ${SNIPER}`, exact: true }).click();

    await expect(notifications(page).getByText(UNIT_BLOCK_TITLE)).toBeVisible();
  });

  test('of a Squad is told as not copied', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER, JAEGER_UNIT]);

    await page.getByRole('main').getByRole('button', { name: SQUAD_CODE_LABEL, exact: true }).click();

    await expect(notifications(page).getByText(SQUAD_BLOCK_TITLE)).toBeVisible();
  });

  test('of a Squad lists each Outdated build', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER, JAEGER_UNIT]);

    await page.getByRole('main').getByRole('button', { name: SQUAD_CODE_LABEL, exact: true }).click();

    await expect(notifications(page).getByText(SQUAD_BLOCK_TEXT)).toBeVisible();
  });
});

test.describe('Build dialog of an Outdated build', () => {
  test('shows the count of its Outdated selections', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);

    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);

    await expect(dialog.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true })).toBeVisible();
  });

  test('checks the Unit once closed after the update', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await dialog.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true }).click();
    await confirmUpdate(page);

    await page.keyboard.press('Escape');

    await expect(loadoutTile(unitCards(page, SNIPER), TACTICAL_VEST_TILE)).toBeVisible();
  });

  test('tells what the check after the update took off', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await dialog.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true }).click();
    await confirmUpdate(page);

    await page.keyboard.press('Escape');

    await expect(unitCheckToast(page).getByText(SERAPH_REPLACED, { exact: true })).toBeVisible();
  });

  test('brings back the caption of the Unit after the update', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await dialog.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true }).click();
    await confirmUpdate(page);

    await page.keyboard.press('Escape');

    await expect(unitCards(page, SNIPER)).toContainText(SNIPER_CAPTION);
  });

  test('clears the outdated step of the mini-tree after the update', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await dialog.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true }).click();
    await confirmUpdate(page);

    await page.keyboard.press('Escape');

    await expect(miniTreeStep(unitCards(page, SNIPER), CLEARED_STEP)).toBeVisible();
  });
});

test.describe('Outdated build updated in the Build calculator', () => {
  test('gets its Unit checked once the Squad opens', async ({ page }) => {
    await openSeededSquad(page, [SERAPH_SNIPER]);
    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
    await panel.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true }).click();
    await confirmUpdate(page);

    await openSquads(page);

    await expect(unitCheckToast(page).getByText(SERAPH_REPLACED, { exact: true })).toBeVisible();
  });
});
