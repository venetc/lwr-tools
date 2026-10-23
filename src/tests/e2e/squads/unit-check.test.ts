import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { buildRemovalDialog, openBuildPanel, selectAbilities, selectAbility } from '../utils/build-panel';
import { loadoutTile, notifications, openBuildDialog, openSquads, seedSquad, squadItem, unitCards } from '../utils/squads';
import { setTabVisibility } from '../utils/tab-visibility';
import {
  AURORA_REPLACED,
  AURORA_SNIPER,
  BIOSOLDIER_PATH,
  BUILD_NOT_FOUND,
  CLASS_PERKS,
  CLASS_TREE_TAB,
  CLOSE_NOTE_TITLE,
  COUNTERCHARGE,
  DELETE_LABEL,
  GENE_MODS_TAB,
  IRON_SKIN,
  LOST_UNIT,
  OFFICER_TAB,
  PSIONIC_TAB,
  REMOVE_BUILD_LABEL,
  REMOVE_HOLD_TIME,
  SECOND_SERAPH_SNIPER,
  SEEDED_SQUAD,
  SEEDED_SQUAD_KEY,
  SERAPH_REPLACED,
  SERAPH_REPLACED_TWICE,
  SERAPH_SNIPER,
  SERAPH_TILE,
  SNIPER,
  STRENGTH_IN_NUMBERS,
  TACTICAL_VEST_CODE,
  TACTICAL_VEST_SNIPER,
  TACTICAL_VEST_TILE,
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
 * Opens the Squad with a Seraph Armor Sniper whose build has an Officer perk, then takes the Officer perk off in the
 * Build dialog of the Unit and returns the dialog, still open.
 *
 * @param page browser page.
 */
const takeOffLastOfficerPerkInDialog = async (page: Page) => {
  await seedSquad(page, [SERAPH_SNIPER]);
  const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
  await selectAbilities(panel, CLASS_TREE_TAB, CLASS_PERKS);
  await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);
  await openSquads(page);
  const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
  await selectAbility(dialog, OFFICER_TAB, STRENGTH_IN_NUMBERS);

  return dialog;
};

/**
 * Notification of what closing the Build dialog takes off. A modal dialog hides the rest of the page from assistive
 * technology, so the notification is looked up among hidden elements too.
 *
 * @param page browser page.
 */
const closeNoteToast = (page: Page) => page
  .getByRole('region', { name: /^Notifications/, includeHidden: true })
  .getByRole('listitem', { includeHidden: true })
  .filter({ hasText: CLOSE_NOTE_TITLE });

/**
 * Notification of a Unit check that changed something.
 *
 * @param page browser page.
 */
const unitCheckToast = (page: Page) => notifications(page).getByRole('listitem').filter({ hasText: TOAST_TITLE });

/**
 * Closes the dialog with its close button.
 *
 * @param dialog dialog.
 */
const closeDialog = (dialog: Locator) => dialog.getByRole('button', { name: 'Close', exact: true }).click();

/**
 * Opens the Squad with an Aurora Armor Sniper whose build has a psionic ability and hides its tab, takes the last
 * psionic ability off in another tab, then comes back to the tab once it shows the edited build.
 *
 * @param page browser page.
 */
const takeOffLastPsionicAbilityInOtherTab = async (page: Page) => {
  await seedSquad(page, [AURORA_SNIPER]);
  const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
  await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);
  await openSquads(page);
  await setTabVisibility(page, 'hidden');
  const otherPage = await page.context().newPage();
  const otherPanel = await openBuildPanel(otherPage, BIOSOLDIER_PATH, SNIPER);
  await selectAbility(otherPanel, PSIONIC_TAB, COUNTERCHARGE);
  await setTabVisibility(otherPage, 'hidden');
  await loadoutTile(unitCards(page, SNIPER), TACTICAL_VEST_TILE).waitFor();
  await setTabVisibility(page, 'visible');
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

test.describe('Unit check after a Build edit', () => {
  test('tells in a notification what closing the Build dialog takes off', async ({ page }) => {
    await takeOffLastOfficerPerkInDialog(page);

    await expect(closeNoteToast(page).getByText(SERAPH_REPLACED, { exact: true })).toBeVisible();
  });

  test('closes the notification once closing the Build dialog takes nothing off', async ({ page }) => {
    const dialog = await takeOffLastOfficerPerkInDialog(page);

    await selectAbility(dialog, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await expect(closeNoteToast(page)).toHaveCount(0);
  });

  test('tells what taking off the last Officer perk took off once the Build dialog closes', async ({ page }) => {
    const dialog = await takeOffLastOfficerPerkInDialog(page);

    await closeDialog(dialog);

    await expect(unitCheckToast(page).getByText(SERAPH_REPLACED, { exact: true })).toBeVisible();
  });

  test('saves the Loadout checked once the Build dialog closes', async ({ page }) => {
    const dialog = await takeOffLastOfficerPerkInDialog(page);

    await closeDialog(dialog);

    await expect.poll(() => storedArmorCode(page, SEEDED_SQUAD_KEY)).toBe(TACTICAL_VEST_CODE);
  });

  test('keeps Seraph Armor when the Officer perk is back before the Build dialog closes', async ({ page }) => {
    const dialog = await takeOffLastOfficerPerkInDialog(page);
    await selectAbility(dialog, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await closeDialog(dialog);

    await expect(loadoutTile(unitCards(page, SNIPER), SERAPH_TILE)).toBeVisible();
  });

  test('keeps Seraph Armor when the tab is back while the Build dialog holds the edit', async ({ page }) => {
    const dialog = await takeOffLastOfficerPerkInDialog(page);
    await setTabVisibility(page, 'hidden');
    await setTabVisibility(page, 'visible');
    await selectAbility(dialog, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await closeDialog(dialog);

    await expect(loadoutTile(unitCards(page, SNIPER), SERAPH_TILE)).toBeVisible();
  });

  test('tells what an edit in another tab took off once the tab is back', async ({ page }) => {
    await takeOffLastPsionicAbilityInOtherTab(page);

    await expect(notifications(page).getByText(AURORA_REPLACED, { exact: true })).toBeVisible();
  });

  test('saves the Loadout checked once the tab is back', async ({ page }) => {
    await takeOffLastPsionicAbilityInOtherTab(page);

    await expect.poll(() => storedArmorCode(page, SEEDED_SQUAD_KEY)).toBe(TACTICAL_VEST_CODE);
  });

  test('removes the Units of a Build deleted in another tab once the tab is back', async ({ page }) => {
    await seedSquad(page, [TACTICAL_VEST_SNIPER]);
    await openSquads(page);
    await setTabVisibility(page, 'hidden');
    const otherPage = await page.context().newPage();
    const otherPanel = await openBuildPanel(otherPage, BIOSOLDIER_PATH, SNIPER);
    await otherPanel.getByRole('button', { name: REMOVE_BUILD_LABEL }).click({ delay: REMOVE_HOLD_TIME });
    await buildRemovalDialog(otherPage, SNIPER).getByRole('button', { name: DELETE_LABEL, exact: true }).click();
    await setTabVisibility(otherPage, 'hidden');
    await unitCards(page, SNIPER).waitFor({ state: 'detached' });

    await setTabVisibility(page, 'visible');

    await expect(squadItem(page, SEEDED_SQUAD, 0)).toBeVisible();
  });
});
