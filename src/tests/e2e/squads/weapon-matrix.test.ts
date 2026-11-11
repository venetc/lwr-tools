import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { overhang } from '../utils/page-layout';
import {
  addSavedUnit,
  itemDetails,
  loadoutTile,
  locker,
  lockerGroup,
  lockerItem,
  openLocker,
  openSquads,
  unitCards,
} from '../utils/squads';
import {
  ARC_RIFLE_OF_OTHERS,
  ASSAULT,
  AUTOPISTOL_CELLS,
  AUTOPISTOL_TYPE,
  BIOSOLDIER_BUILDS,
  CARBINE_TYPE,
  CLASS_LIMITED,
  EQUIPPED_RIFLE,
  JAEGER,
  LASER_LANCE,
  LASER_RIFLE,
  LASER_RIFLE_TILE,
  LASER_VULCAN,
  LMG_OF_GUNNER,
  LMG_TYPE,
  MAIN_TABLE,
  MEC_BUILDS,
  MEC_PRIMARY_TILE,
  PLASMA_SHOTGUN,
  PRIMARY_TILE,
  SECONDARY_TILE,
  SHIV,
  SHIV_BUILDS,
  SHIV_PRIMARY_TILE,
  SNIPER,
  TIER_NAME,
  TIERS,
  UNAVAILABLE,
} from './weapon-matrix.mock';

/**
 * Tier names of the matrix head.
 *
 * @param dialog Locker dialog.
 */
const tierNames = (dialog: Locator) => locker(dialog).getByText(TIER_NAME);

/**
 * Row of the weapon matrix in a group of the Locker.
 *
 * @param dialog Locker dialog.
 * @param group group name; `Locker` for the rows that fit.
 * @param typeName weapon type name of the row.
 */
const matrixRow = (dialog: Locator, group: string, typeName: string) => lockerGroup(dialog, group).getByRole('listitem').filter({ hasText: typeName }).first();

/**
 * Opens the Primary Locker of a new Assault.
 *
 * @param page browser page.
 */
const openAssaultPrimary = async (page: Page) => {
  await openSquads(page);
  await addSavedUnit(page, BIOSOLDIER_BUILDS, ASSAULT);

  return openLocker(page, unitCards(page, ASSAULT), PRIMARY_TILE);
};

test.describe('Weapon matrix of the Locker', () => {
  test('heads the Primary Locker of a biosoldier with a column of every tier', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await expect(tierNames(dialog)).toHaveText(TIERS);
  });

  test('shows the weapon types the class may use in the main table', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await expect(lockerGroup(dialog, MAIN_TABLE).getByRole('button', { name: PLASMA_SHOTGUN, exact: true })).toBeVisible();
  });

  test('moves a type of another class to Unavailable with its reason', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await expect(matrixRow(dialog, UNAVAILABLE, LMG_TYPE)).toContainText(CLASS_LIMITED);
  });

  test('lists an Arc Rifle of other classes under Unavailable', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), PRIMARY_TILE);

    await expect(lockerGroup(dialog, UNAVAILABLE).getByRole('button', { name: ARC_RIFLE_OF_OTHERS, exact: true })).toBeVisible();
  });

  test('leaves the cells of tiers a type lacks empty, not buttons', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ASSAULT);
    const dialog = await openLocker(page, unitCards(page, ASSAULT), SECONDARY_TILE);

    await expect(matrixRow(dialog, MAIN_TABLE, AUTOPISTOL_TYPE).getByRole('button')).toHaveCount(AUTOPISTOL_CELLS);
  });

  test('picks the equipped weapon on open', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await expect(lockerItem(dialog, EQUIPPED_RIFLE)).toHaveAttribute('aria-pressed', 'true');
  });

  test('names the weapon of a cell in its tooltip', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await expect(lockerItem(dialog, LASER_RIFLE)).toHaveAttribute('title', LASER_RIFLE);
  });

  test('shows the details of a clicked cell', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await lockerItem(dialog, LASER_RIFLE).click();

    await expect(itemDetails(dialog).getByRole('heading')).toHaveText(LASER_RIFLE);
  });

  test('puts a weapon on with a double click on its cell', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await lockerItem(dialog, LASER_RIFLE).dblclick();

    await expect(loadoutTile(unitCards(page, ASSAULT), LASER_RIFLE_TILE)).toBeVisible();
  });

  test('closes the dialog after a double click on a cell', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await lockerItem(dialog, LASER_RIFLE).dblclick();

    await expect(dialog).toBeHidden();
  });

  test('ignores a double click on a cell that does not fit', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    await lockerItem(dialog, LMG_OF_GUNNER).dblclick();

    await expect(locker(dialog)).toBeVisible();
  });

  test('shows the Primary weapons of a MEC as a matrix', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);
    const dialog = await openLocker(page, unitCards(page, JAEGER), MEC_PRIMARY_TILE);

    await expect(lockerGroup(dialog, MAIN_TABLE).getByRole('button', { name: LASER_LANCE, exact: true })).toBeVisible();
  });

  test('shows the Primary weapons of a SHIV as a matrix', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);
    const dialog = await openLocker(page, unitCards(page, SHIV), SHIV_PRIMARY_TILE);

    await expect(lockerGroup(dialog, MAIN_TABLE).getByRole('button', { name: LASER_VULCAN, exact: true })).toBeVisible();
  });
});

test.describe('Weapon matrix on a phone', { tag: '@phone' }, () => {
  test('puts the type name above its cells', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);
    const row = matrixRow(dialog, MAIN_TABLE, CARBINE_TYPE);

    const [nameBox, cellBox] = await Promise.all([row.getByText(CARBINE_TYPE, { exact: true }).boundingBox(), row.getByRole('button').first().boundingBox()]);

    expect((cellBox?.y ?? 0) - ((nameBox?.y ?? 0) + (nameBox?.height ?? 0))).toBeGreaterThanOrEqual(0);
  });

  test('fits the matrix in the width of the dialog', async ({ page }) => {
    const dialog = await openAssaultPrimary(page);

    expect(await overhang(lockerItem(dialog, PLASMA_SHOTGUN), dialog)).toBeLessThanOrEqual(0);
  });
});
