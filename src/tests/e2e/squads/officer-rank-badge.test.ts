import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openBuildPanel, selectAbilities, selectAbility } from '../utils/build-panel';
import { addSavedUnit, openAddUnit, openSquads, savedBuildRow, unitCards } from '../utils/squads';
import {
  ANY_OFFICER_RANK,
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  CLASS_TREE_TAB,
  JAEGER,
  LIEUTENANT,
  LIEUTENANT_ABBREVIATION,
  MAGNUM,
  MEC_BUILDS,
  OFFICER_TAB,
  SHARPSHOOTER,
  SNIPER,
  STRENGTH_IN_NUMBERS,
} from './officer-rank-badge.mock';

/**
 * Gives the Sniper build a Lieutenant officer perk in the Build calculator, then opens the Squad planner.
 *
 * @param page browser page.
 */
const trainLieutenant = async (page: Page) => {
  const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
  await selectAbilities(panel, CLASS_TREE_TAB, [MAGNUM, SHARPSHOOTER]);
  await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);
  await openSquads(page);
};

test.describe('Officer rank badge in the Squad planner', () => {
  test('shows the senior officer rank on the Unit card', async ({ page }) => {
    await trainLieutenant(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER).getByRole('img', { name: LIEUTENANT })).toHaveText(LIEUTENANT_ABBREVIATION);
  });

  test('is absent from the Unit card of a build without officer perks', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER).getByRole('img', { name: ANY_OFFICER_RANK })).toHaveCount(0);
  });

  test('is absent from the Unit card of a MEC', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    await expect(unitCards(page, JAEGER).getByRole('img', { name: ANY_OFFICER_RANK })).toHaveCount(0);
  });

  test('shows the senior officer rank on the saved build row of Add Unit', async ({ page }) => {
    await trainLieutenant(page);

    const dialog = await openAddUnit(page);

    await expect(savedBuildRow(dialog, BIOSOLDIER_BUILDS, SNIPER).getByRole('img', { name: LIEUTENANT })).toHaveText(LIEUTENANT_ABBREVIATION);
  });
});
