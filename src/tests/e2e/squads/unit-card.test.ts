import { expect, test } from '@playwright/test';

import { openBuildPanel, selectAbility } from '../utils/build-panel';
import { addSavedUnit, openSquads, seedSquad, unitCards } from '../utils/squads';
import {
  ARCHANGEL_SNIPER,
  AURORA_SNIPER,
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  COUNTERCHARGE,
  EMPTY_UTILITY,
  GEAR_SLOT,
  GUNNER,
  GUNNER_TILES,
  JAEGER,
  MEC_BUILDS,
  MEC_TILES,
  PSI_SLOT,
  PSIONIC_TAB,
  ROCKETEER,
  ROCKETEER_SECONDARY,
  SHIV,
  SHIV_BUILDS,
  SHIV_TILES,
  SNIPER,
  SNIPER_TILES,
} from './unit-card.mock';

test.describe('Unit card', () => {
  test('shows the Default Loadout of a biosoldier in inventory order', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER)).toMatchAriaSnapshot(SNIPER_TILES);
  });

  test('has no secondary tile for a Gunner', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, GUNNER);

    await expect(unitCards(page, GUNNER)).toMatchAriaSnapshot(GUNNER_TILES);
  });

  test('shows the rocket launcher of a Rocketeer', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);

    await expect(unitCards(page, ROCKETEER).getByRole('button', { name: ROCKETEER_SECONDARY })).toBeVisible();
  });

  test('shows the exoskeleton and Module slot of a MEC without a secondary tile', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    await expect(unitCards(page, JAEGER)).toMatchAriaSnapshot(MEC_TILES);
  });

  test('shows the SHIV type of a SHIV without a secondary tile', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, SHIV_BUILDS, SHIV);

    await expect(unitCards(page, SHIV)).toMatchAriaSnapshot(SHIV_TILES);
  });

  test('draws an empty slot dashed', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER).getByRole('button', { name: EMPTY_UTILITY }).first()).toHaveCSS('border-top-style', 'dashed');
  });

  test('captions the Gear Slot', async ({ page }) => {
    await seedSquad(page, [ARCHANGEL_SNIPER]);

    await openSquads(page);

    await expect(unitCards(page, SNIPER).getByRole('button', { name: GEAR_SLOT })).toHaveCount(1);
  });

  test('captions the Psi Slot', async ({ page }) => {
    await seedSquad(page, [AURORA_SNIPER]);
    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);

    await openSquads(page);

    await expect(unitCards(page, SNIPER).getByRole('button', { name: PSI_SLOT })).toHaveCount(1);
  });

  test('colours a Gear Slot apart from a utility slot', async ({ page }) => {
    await seedSquad(page, [ARCHANGEL_SNIPER]);
    await openSquads(page);
    const card = unitCards(page, SNIPER);

    const [utilityColor, gearSlotColor] = await Promise.all([EMPTY_UTILITY, GEAR_SLOT].map(name => (
      card.getByRole('button', { name }).first().locator('span span').first().evaluate(element => getComputedStyle(element).color)
    )));

    expect(gearSlotColor).not.toBe(utilityColor);
  });
});
