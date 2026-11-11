import { expect, test } from '@playwright/test';

import {
  addSavedUnit,
  itemDetails,
  locker,
  lockerGroup,
  lockerItem,
  notifications,
  openLocker,
  openSquads,
  seedSquad,
  unitCards,
} from '../utils/squads';
import {
  ADVANCED_LAUNCHER_STACKED,
  ALLOY_SHIV_TILE,
  DAUNTLESS,
  DAUNTLESS_TILES,
  DAUNTLESS_TOAST,
  EMPTY_MODULE_TILE,
  EMPTY_UTILITY_TILE,
  EQUIPPED_ALLOY_SHIV,
  EXOSKELETON_CAPTION,
  EXOSKELETON_CARRIERS,
  EXOSKELETON_GROUPS,
  HEAVY_MAGS,
  HEAVY_MAGS_CARRIERS,
  HOVER_SHIV,
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
  SHIV_TYPE_CAPTION,
  SHIV_TYPE_CARRIERS,
  SHIV_TYPE_EQUIPPED,
  SHIV_TYPE_TILE,
  THUMPER_BLOCKED,
  UNTITLED_GROUP,
} from './loadout-dialog-mec-shiv.mock';

test.describe('Locker dialog of a MEC', () => {
  test('is titled MEC exoskeleton for the exoskeleton slot', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    await openLocker(page, unitCards(page, JAEGER), PALADIN_TILE);

    await expect(page.getByRole('dialog', { name: EXOSKELETON_CAPTION, exact: true })).toBeVisible();
  });

  test('groups exoskeletons by armor category', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    const dialog = await openLocker(page, unitCards(page, JAEGER), PALADIN_TILE);

    await expect(locker(dialog).getByRole('heading')).toHaveText(EXOSKELETON_GROUPS);
  });

  test('lists the Modules that fit without a group name', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    const dialog = await openLocker(page, unitCards(page, JAEGER), EMPTY_MODULE_TILE);

    await expect(lockerGroup(dialog, UNTITLED_GROUP)).toBeVisible();
  });

  test('counts the slots again for a new exoskeleton', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);
    const dialog = await openLocker(page, unitCards(page, JAEGER), PALADIN_TILE);

    await lockerItem(dialog, DAUNTLESS).dblclick();

    await expect(unitCards(page, JAEGER)).toMatchAriaSnapshot(DAUNTLESS_TILES);
  });

  test('tells the new slot counts of the exoskeleton in a toast', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);
    const dialog = await openLocker(page, unitCards(page, JAEGER), PALADIN_TILE);

    await lockerItem(dialog, DAUNTLESS).dblclick();

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

test.describe('Locker dialog of a SHIV', () => {
  test('is titled SHIV type for the SHIV type slot', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);

    await openLocker(page, unitCards(page, SHIV), SHIV_TYPE_TILE);

    await expect(page.getByRole('dialog', { name: SHIV_TYPE_CAPTION, exact: true })).toBeVisible();
  });

  test('lists the SHIV types that fit without a group name', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);

    const dialog = await openLocker(page, unitCards(page, SHIV), SHIV_TYPE_TILE);

    await expect(lockerGroup(dialog, UNTITLED_GROUP)).toBeVisible();
  });

  test('keeps Equip in view for a SHIV type with a long description', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);
    const dialog = await openLocker(page, unitCards(page, SHIV), SHIV_TYPE_TILE);

    await lockerItem(dialog, HOVER_SHIV).click();

    await expect(dialog.getByRole('button', { name: 'Equip', exact: true })).toBeInViewport();
  });

  test('removes the items of the slots a smaller SHIV type lacks', async ({ page }) => {
    await seedSquad(page, [EQUIPPED_ALLOY_SHIV]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SHIV), ALLOY_SHIV_TILE);

    await lockerItem(dialog, SHIV_TYPE).dblclick();

    await expect(unitCards(page, SHIV)).toMatchAriaSnapshot(SHIV_TILES);
  });

  test('tells about the items a smaller SHIV type removes in a toast', async ({ page }) => {
    await seedSquad(page, [EQUIPPED_ALLOY_SHIV]);
    await openSquads(page);
    const dialog = await openLocker(page, unitCards(page, SHIV), ALLOY_SHIV_TILE);

    await lockerItem(dialog, SHIV_TYPE).dblclick();

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
