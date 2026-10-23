import { expect, test } from '@playwright/test';

import {
  addSavedUnit,
  itemDetails,
  lockerItem,
  notifications,
  openLoadoutDialog,
  openLocker,
  openSquads,
  seedSquad,
  unitCards,
} from '../utils/squads';
import {
  ADVANCED_LAUNCHER_STACKED,
  ALLOY_SHIV_TILE,
  DAUNTLESS,
  DAUNTLESS_INVENTORY,
  DAUNTLESS_JAEGER,
  DAUNTLESS_TILE,
  DAUNTLESS_TILES,
  DAUNTLESS_TOAST,
  EMPTY_MODULE_TILE,
  EMPTY_UTILITY_TILE,
  EQUIPPED_ALLOY_SHIV,
  EXOSKELETON_CARRIERS,
  HEAVY_MAGS,
  HEAVY_MAGS_CARRIERS,
  INCINERATOR_BLOCKED,
  JAEGER,
  LAUNCHER_JAEGER,
  MEC_BUILDS,
  PALADIN_TILE,
  SHIV,
  SHIV_BUILDS,
  SHIV_SHRUNK_TOAST,
  SHIV_TILES,
  SHIV_TYPE,
  SHIV_TYPE_CARRIERS,
  SHIV_TYPE_EQUIPPED,
  SHIV_TYPE_TILE,
  THUMPER_BLOCKED,
} from './loadout-dialog-mec-shiv.mock';

test.describe('Loadout dialog of a MEC', () => {
  test('lists the Module slots and utility slots of the exoskeleton in INVENTORY', async ({ page }) => {
    await seedSquad(page, [DAUNTLESS_JAEGER]);
    await openSquads(page);

    const dialog = await openLoadoutDialog(page, unitCards(page, JAEGER), DAUNTLESS_TILE);

    await expect(dialog).toMatchAriaSnapshot(DAUNTLESS_INVENTORY);
  });

  test('counts the slots again for a new exoskeleton', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);
    const dialog = await openLocker(page, unitCards(page, JAEGER), PALADIN_TILE);

    await lockerItem(dialog, DAUNTLESS).dblclick();
    await page.keyboard.press('Escape');

    await expect(unitCards(page, JAEGER)).toMatchAriaSnapshot(DAUNTLESS_TILES);
  });

  test('tells the new slot counts of the exoskeleton in a toast', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);
    const dialog = await openLocker(page, unitCards(page, JAEGER), PALADIN_TILE);

    await lockerItem(dialog, DAUNTLESS).dblclick();
    await page.keyboard.press('Escape');

    await expect(notifications(page)).toContainText(DAUNTLESS_TOAST);
  });

  test('keeps the Advanced Launcher off a MEC with a Grenade Launcher', async ({ page }) => {
    await seedSquad(page, [LAUNCHER_JAEGER]);
    await openSquads(page);

    const dialog = await openLocker(page, unitCards(page, JAEGER), EMPTY_MODULE_TILE);

    await expect(lockerItem(dialog, ADVANCED_LAUNCHER_STACKED)).toBeVisible();
  });

  test('needs the Kinetic Strike Module for The Thumper', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    const dialog = await openLocker(page, unitCards(page, JAEGER), EMPTY_UTILITY_TILE);

    await expect(lockerItem(dialog, THUMPER_BLOCKED)).toBeVisible();
  });

  test('needs the Flamethrower for the Incinerator Amp', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    const dialog = await openLocker(page, unitCards(page, JAEGER), EMPTY_UTILITY_TILE);

    await expect(lockerItem(dialog, INCINERATOR_BLOCKED)).toBeVisible();
  });

  test('shows the Carriers of an exoskeleton in its details', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);
    const dialog = await openLocker(page, unitCards(page, JAEGER), PALADIN_TILE);

    await lockerItem(dialog, DAUNTLESS).click();

    await expect(itemDetails(dialog)).toContainText(EXOSKELETON_CARRIERS);
  });

  test('shows the Carriers of equipment of MECs and SHIVs in its details', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);
    const dialog = await openLocker(page, unitCards(page, JAEGER), EMPTY_UTILITY_TILE);

    await lockerItem(dialog, HEAVY_MAGS).click();

    await expect(itemDetails(dialog)).toContainText(HEAVY_MAGS_CARRIERS);
  });
});

test.describe('Loadout dialog of a SHIV', () => {
  test('removes the items of the slots a smaller SHIV type lacks', async ({ page }) => {
    await seedSquad(page, [EQUIPPED_ALLOY_SHIV]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SHIV), ALLOY_SHIV_TILE);

    await lockerItem(dialog, SHIV_TYPE).dblclick();
    await page.keyboard.press('Escape');

    await expect(unitCards(page, SHIV)).toMatchAriaSnapshot(SHIV_TILES);
  });

  test('tells about the items a smaller SHIV type removes in a toast', async ({ page }) => {
    await seedSquad(page, [EQUIPPED_ALLOY_SHIV]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SHIV), ALLOY_SHIV_TILE);

    await lockerItem(dialog, SHIV_TYPE).dblclick();
    await page.keyboard.press('Escape');

    await expect(notifications(page)).toContainText(SHIV_SHRUNK_TOAST);
  });

  test('shows the Carriers of a SHIV type in its details', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);
    const dialog = await openLocker(page, unitCards(page, SHIV), SHIV_TYPE_TILE);

    await lockerItem(dialog, SHIV_TYPE_EQUIPPED).click();

    await expect(itemDetails(dialog)).toContainText(SHIV_TYPE_CARRIERS);
  });
});
