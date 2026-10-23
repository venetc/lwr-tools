import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { selectAbilities, selectAbility } from '../utils/build-panel';
import {
  addSavedUnit,
  inventoryRow,
  itemDetails,
  loadoutTile,
  locker,
  lockerItem,
  notifications,
  openBuildDialog,
  openLoadoutDialog,
  openLocker,
  openSquads,
  seedSquad,
  unitCards,
} from '../utils/squads';
import {
  ALLOY_SNIPER,
  ARCHANGEL,
  ARCHANGEL_FORMULA,
  ARCHANGEL_SNIPER,
  ARCHANGEL_TILE,
  ARMOR_LOCKER,
  ARMOR_TILE,
  ASSAULT_RIFLE,
  BIOSOLDIER_BUILDS,
  CERAMIC_STACKED,
  CHITIN_BLOCKED,
  CHITIN_REASONS,
  CLASS_TREE_TAB,
  EMPTY_GEAR_SLOT_TILE,
  EMPTY_UTILITY_TILE,
  ENHANCED_METABOLISM,
  EQUIPPED_VEST,
  GENE_MODS_TAB,
  GHOST,
  GHOST_BLOCKED,
  GRENADE_SNIPER,
  GRENADE_TILE,
  GRENADIER_SNIPER,
  GUNNER,
  HE_GRENADE,
  HE_GRENADE_EQUIPPED,
  HE_GRENADE_IN_GEAR_SLOT,
  HE_GRENADE_TWICE,
  LASER_RIFLE_TILE,
  LIEUTENANT_PERKS,
  LMG,
  LMG_TOAST,
  MOVED_TOAST,
  OFFICER_MARK,
  OFFICER_TAB,
  PISTOL,
  PISTOL_EQUIPPED,
  PISTOL_SNIPER,
  PISTOL_TILE,
  PLATED_ARCHANGEL_SNIPER,
  PRIMARY_TILE,
  PSI_GRENADE_BLOCKED,
  REAPER_SNIPER,
  REAPER_TOAST,
  SCANNER_CARRIERS,
  SCANNER_OF_SCOUT,
  SECONDARY_TILE,
  SERAPH,
  SERAPH_BLOCKED,
  SHRUNK_TOAST,
  SNIPER,
  STRENGTH_IN_NUMBERS,
  TACTICAL_VEST,
  VEST_FORMULA,
} from './loadout-dialog.mock';

test.describe('Loadout dialog of a biosoldier', () => {
  test('selects the slot of the clicked tile', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLoadoutDialog(page, unitCards(page, SNIPER), PRIMARY_TILE);

    await expect(inventoryRow(dialog, PRIMARY_TILE)).toHaveAttribute('aria-pressed', 'true');
  });

  test('lists the armor that fits first, then the rest with their reasons', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(locker(dialog)).toMatchAriaSnapshot(ARMOR_LOCKER);
  });

  test('marks the item in the slot as equipped', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(lockerItem(dialog, EQUIPPED_VEST)).toBeVisible();
  });

  test('shows every reason of an item in its details', async ({ page }) => {
    await seedSquad(page, [ALLOY_SNIPER]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);

    await lockerItem(dialog, CHITIN_BLOCKED).click();

    await expect(itemDetails(dialog)).toMatchAriaSnapshot(CHITIN_REASONS);
  });

  test('shows the Carriers of an item in its details', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);

    await lockerItem(dialog, SCANNER_OF_SCOUT).click();

    await expect(itemDetails(dialog)).toContainText(SCANNER_CARRIERS);
  });

  test('disables Equip for an item that does not fit', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await lockerItem(dialog, GHOST_BLOCKED).click();

    await expect(dialog.getByRole('button', { name: 'Equip', exact: true })).toBeDisabled();
  });

  test('puts the picked item on with Equip', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);
    await lockerItem(dialog, HE_GRENADE).click();

    await dialog.getByRole('button', { name: 'Equip', exact: true }).click();

    await expect(lockerItem(dialog, HE_GRENADE_EQUIPPED)).toBeVisible();
  });

  test('puts an item on with a double click', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);

    await lockerItem(dialog, HE_GRENADE).dblclick();

    await expect(lockerItem(dialog, HE_GRENADE_EQUIPPED)).toBeVisible();
  });

  test('shows the new item on the card', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);
    await lockerItem(dialog, HE_GRENADE).dblclick();

    await page.keyboard.press('Escape');

    await expect(loadoutTile(unitCards(page, SNIPER), GRENADE_TILE)).toBeVisible();
  });

  test('keeps the Loadout after a reload', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);
    await lockerItem(dialog, HE_GRENADE).dblclick();

    await openSquads(page);

    await expect(loadoutTile(unitCards(page, SNIPER), GRENADE_TILE)).toBeVisible();
  });

  test('offers no Remove for armor', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(dialog.getByRole('button', { name: 'Remove', exact: true })).toHaveCount(0);
  });

  test('offers no Remove for the primary weapon', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), PRIMARY_TILE);

    await expect(dialog.getByRole('button', { name: 'Remove', exact: true })).toHaveCount(0);
  });

  test('takes the secondary weapon off with Remove', async ({ page }) => {
    await seedSquad(page, [PISTOL_SNIPER]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SNIPER), PISTOL_TILE);

    await dialog.getByRole('button', { name: 'Remove', exact: true }).click();

    await expect(lockerItem(dialog, PISTOL)).toBeVisible();
  });

  test('takes utility equipment off with Remove', async ({ page }) => {
    await seedSquad(page, [GRENADE_SNIPER]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SNIPER), GRENADE_TILE);

    await dialog.getByRole('button', { name: 'Remove', exact: true }).click();

    await expect(lockerItem(dialog, HE_GRENADE)).toBeVisible();
  });

  test('puts a secondary weapon on', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), SECONDARY_TILE);

    await lockerItem(dialog, PISTOL).dblclick();

    await expect(lockerItem(dialog, PISTOL_EQUIPPED)).toBeVisible();
  });

  test('explains the number of utility slots', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLoadoutDialog(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(dialog.getByText(VEST_FORMULA, { exact: true })).toBeVisible();
  });

  test('explains the Gear Slot of the armor', async ({ page }) => {
    await seedSquad(page, [ARCHANGEL_SNIPER]);
    await openSquads(page);

    const dialog = await openLoadoutDialog(page, unitCards(page, SNIPER), ARCHANGEL_TILE);

    await expect(dialog.getByText(ARCHANGEL_FORMULA, { exact: true })).toBeVisible();
  });

  test('removes an item of a slot the new armor lacks with a toast', async ({ page }) => {
    await seedSquad(page, [PLATED_ARCHANGEL_SNIPER]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SNIPER), ARCHANGEL_TILE);

    await lockerItem(dialog, TACTICAL_VEST).dblclick();
    await page.keyboard.press('Escape');

    await expect(notifications(page)).toContainText(SHRUNK_TOAST);
  });

  test('moves an item out of a Gear Slot with a toast', async ({ page }) => {
    await seedSquad(page, [GRENADIER_SNIPER]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await lockerItem(dialog, ARCHANGEL).dblclick();
    await page.keyboard.press('Escape');

    await expect(notifications(page)).toContainText(MOVED_TOAST);
  });

  test('takes utility slots away for an LMG', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, GUNNER);
    const dialog = await openLocker(page, unitCards(page, GUNNER), PRIMARY_TILE);

    await lockerItem(dialog, LMG).dblclick();
    await page.keyboard.press('Escape');

    await expect(notifications(page)).toContainText(LMG_TOAST);
  });

  test('removes ammo of another weapon tier with a toast', async ({ page }) => {
    await seedSquad(page, [REAPER_SNIPER]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SNIPER), LASER_RIFLE_TILE);

    await lockerItem(dialog, ASSAULT_RIFLE).dblclick();
    await page.keyboard.press('Escape');

    await expect(notifications(page)).toContainText(REAPER_TOAST);
  });

  test('keeps a grenade out of a Gear Slot', async ({ page }) => {
    await seedSquad(page, [ARCHANGEL_SNIPER]);
    await openSquads(page);

    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_GEAR_SLOT_TILE);

    await expect(lockerItem(dialog, HE_GRENADE_IN_GEAR_SLOT)).toBeVisible();
  });

  test('does not stack a second plating', async ({ page }) => {
    await seedSquad(page, [ALLOY_SNIPER]);
    await openSquads(page);

    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);

    await expect(lockerItem(dialog, CERAMIC_STACKED)).toBeVisible();
  });

  test('allows one of each item', async ({ page }) => {
    await seedSquad(page, [GRENADE_SNIPER]);
    await openSquads(page);

    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);

    await expect(lockerItem(dialog, HE_GRENADE_TWICE)).toBeVisible();
  });

  test('limits an item of a Scout to its class', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);

    await expect(lockerItem(dialog, SCANNER_OF_SCOUT)).toBeVisible();
  });

  test('needs a Psionic ability for a psi item', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), EMPTY_UTILITY_TILE);

    await expect(lockerItem(dialog, PSI_GRENADE_BLOCKED)).toBeVisible();
  });

  test('needs a Gene mod for Ghost Armor', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(lockerItem(dialog, GHOST_BLOCKED)).toBeVisible();
  });

  test('lets Ghost Armor on once the build has a Gene mod', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const buildDialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await selectAbility(buildDialog, GENE_MODS_TAB, ENHANCED_METABOLISM);
    await page.keyboard.press('Escape');

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(lockerItem(dialog, GHOST)).toBeVisible();
  });
});

test.describe('Seraph Armor of an Officer', () => {
  /**
   * Selects the Officer perk of Lieutenant in the build of the Unit through its Build dialog.
   *
   * @param buildDialog Build dialog of the Unit.
   */
  const selectLieutenantPerk = async (buildDialog: Locator) => {
    await selectAbilities(buildDialog, CLASS_TREE_TAB, LIEUTENANT_PERKS);
    await selectAbility(buildDialog, OFFICER_TAB, STRENGTH_IN_NUMBERS);
  };

  test('keeps Seraph Armor dim with Needs officer while the build has no Officer perks', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(lockerItem(dialog, SERAPH_BLOCKED)).toBeVisible();
  });

  test('lets Seraph Armor on once the build has an Officer perk', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    await selectLieutenantPerk(await openBuildDialog(page, unitCards(page, SNIPER), SNIPER));
    await page.keyboard.press('Escape');

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(lockerItem(dialog, SERAPH)).toBeVisible();
  });

  test('lets Seraph Armor on an Officer with a Gene mod', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const buildDialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await selectAbility(buildDialog, GENE_MODS_TAB, ENHANCED_METABOLISM);
    await selectLieutenantPerk(buildDialog);
    await page.keyboard.press('Escape');

    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(lockerItem(dialog, SERAPH)).toBeVisible();
  });

  test('has no Officer switch on the Unit card', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const card = unitCards(page, SNIPER);

    await expect(card.getByRole('checkbox', { name: OFFICER_MARK }).or(card.getByRole('switch', { name: OFFICER_MARK }))).toHaveCount(0);
  });
});

test.describe('Loadout dialog on a phone', () => {
  test.skip(({ isMobile }) => !isMobile, 'Phone layout only');

  test('shows INVENTORY first', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openLoadoutDialog(page, unitCards(page, SNIPER), ARMOR_TILE);

    await expect(locker(dialog)).toBeHidden();
  });

  test('opens the LOCKER of a slot as a second screen', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLoadoutDialog(page, unitCards(page, SNIPER), ARMOR_TILE);

    await inventoryRow(dialog, ARMOR_TILE).click();

    await expect(inventoryRow(dialog, ARMOR_TILE)).toBeHidden();
  });

  test('returns to INVENTORY', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openLocker(page, unitCards(page, SNIPER), ARMOR_TILE);

    await dialog.getByRole('button', { name: '‹ Inventory', exact: true }).click();

    await expect(inventoryRow(dialog, ARMOR_TILE)).toBeVisible();
  });
});
