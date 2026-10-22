import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openBuildPanel, selectAbilities, selectAbility } from '../utils/build-panel';
import { loadoutTile, notifications, openSquads, seedSquad, squadItem, unitCards } from '../utils/squads';
import {
  AURORA_REPLACED,
  AURORA_SNIPER,
  BIOSOLDIER_PATH,
  BUILD_NOT_FOUND,
  CLASS_PERKS,
  CLASS_TREE_TAB,
  COUNTERCHARGE,
  GENE_MODS_TAB,
  IRON_SKIN,
  LOST_UNIT,
  OFFICER_TAB,
  PSIONIC_TAB,
  SECOND_SERAPH_SNIPER,
  SEEDED_SQUAD,
  SEEDED_SQUAD_KEY,
  SERAPH_REPLACED_TWICE,
  SERAPH_SNIPER,
  SERAPH_TILE,
  SNIPER,
  STRENGTH_IN_NUMBERS,
  TACTICAL_VEST_CODE,
  TOAST_TITLE,
} from './unit-check.mock';

/**
 * Opens the Squad with an Aurora Armor Sniper whose build has a psionic ability, then takes the last psionic ability
 * off in the Build calculator and opens the Squad planner again.
 *
 * @param page browser page.
 */
const takeOffLastPsionicAbility = async (page: Page) => {
  await seedSquad(page, [AURORA_SNIPER]);
  const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
  await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);
  await openSquads(page);
  const editedPanel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
  await selectAbility(editedPanel, PSIONIC_TAB, COUNTERCHARGE);
  await openSquads(page);
};

/**
 * Armor code of the first Unit the seeded Squad keeps in the storage.
 *
 * @param page browser page.
 * @param key storage key of the Squad.
 */
const storedArmorCode = (page: Page, key: string) => page.evaluate(storageKey => JSON.parse(localStorage.getItem(storageKey) ?? '{}').units?.[0]?.loadout.armor ?? null, key);

test.describe('Unit check when a Squad opens', () => {
  test('tells what taking off the last psionic ability in the Build calculator took off', async ({ page }) => {
    await takeOffLastPsionicAbility(page);

    await expect(notifications(page).getByText(AURORA_REPLACED, { exact: true })).toBeVisible();
  });

  test('titles the toast Loadouts updated', async ({ page }) => {
    await takeOffLastPsionicAbility(page);

    await expect(notifications(page).getByText(TOAST_TITLE, { exact: true })).toBeVisible();
  });

  test('saves the checked Loadout', async ({ page }) => {
    await takeOffLastPsionicAbility(page);

    await expect.poll(() => storedArmorCode(page, SEEDED_SQUAD_KEY)).toBe(TACTICAL_VEST_CODE);
  });

  test('keeps Seraph Armor of an Officer with a gene mod', async ({ page }) => {
    await seedSquad(page, [SERAPH_SNIPER]);
    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
    await selectAbilities(panel, CLASS_TREE_TAB, CLASS_PERKS);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await openSquads(page);

    await expect(loadoutTile(unitCards(page, SNIPER), SERAPH_TILE)).toBeVisible();
  });

  test('groups the changed Units of one Build on one line', async ({ page }) => {
    await seedSquad(page, [SERAPH_SNIPER, SECOND_SERAPH_SNIPER]);

    await openSquads(page);

    await expect(notifications(page).getByText(SERAPH_REPLACED_TWICE, { exact: true })).toBeVisible();
  });

  test('removes the Units of a deleted Build from the Squad', async ({ page }) => {
    await seedSquad(page, [AURORA_SNIPER, LOST_UNIT]);
    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);

    await openSquads(page);

    await expect(squadItem(page, SEEDED_SQUAD, 1)).toBeVisible();
  });

  test('tells the Units of a deleted Build on the last line', async ({ page }) => {
    await seedSquad(page, [LOST_UNIT]);

    await openSquads(page);

    await expect(notifications(page).getByText(BUILD_NOT_FOUND, { exact: true })).toBeVisible();
  });
});
