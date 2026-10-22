import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel, selectAbility } from '../utils/build-panel';
import {
  CAPTAIN,
  CLASS_TREE_TAB,
  COMMANDING_OFFICER,
  COVER_TACTICS,
  LIEUTENANT,
  LOCK_LABEL,
  MAGNUM,
  OFFICER_TAB,
  OFFICER_TAB_WITH_ONE,
  PAGE_PATH,
  PANEL_NAME,
  RANGER,
  REQUIRES_CORPORAL,
  REQUIRES_LIEUTENANT,
  REQUIRES_SERGEANT,
  SHARPSHOOTER,
  STAY_FROSTY,
  STRENGTH_IN_NUMBERS,
} from './officer-tab.mock';

/**
 * Opens the Biosoldier Build calculator with the default builds and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Selects the perks of the Class tree up to the rank, one per rank from Lance Corporal.
 *
 * @param panel build panel.
 * @param perkNames perk names by rank.
 */
const selectPerks = async (panel: Locator, perkNames: string[]) => {
  for (const perkName of perkNames) await selectAbility(panel, CLASS_TREE_TAB, perkName);
};

/**
 * Row of the officer rank on the Officer tab.
 *
 * @param panel build panel.
 * @param officerRankName officer rank name.
 */
const officerRankRow = (panel: Locator, officerRankName: string) => (
  panel.getByRole('listitem').filter({ has: panel.page().getByRole('group', { name: officerRankName, exact: true }) })
);

test.describe('Officer tab', () => {
  test('locks Lieutenant of a default build until Corporal', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await expect(officerRankRow(panel, LIEUTENANT).getByText(REQUIRES_CORPORAL)).toBeVisible();
  });

  test('opens Lieutenant once a perk is selected on Corporal', async ({ page }) => {
    const panel = await openPanel(page);
    await selectPerks(panel, [MAGNUM, SHARPSHOOTER]);

    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await expect(abilityCell(panel, STRENGTH_IN_NUMBERS)).not.toHaveAttribute('aria-disabled', 'true');
  });

  test('locks Captain until Sergeant', async ({ page }) => {
    const panel = await openPanel(page);
    await selectPerks(panel, [MAGNUM, SHARPSHOOTER]);

    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await expect(officerRankRow(panel, CAPTAIN).getByText(REQUIRES_SERGEANT)).toBeVisible();
  });

  test('locks Captain until Lieutenant once Sergeant is completed', async ({ page }) => {
    const panel = await openPanel(page);
    await selectPerks(panel, [MAGNUM, SHARPSHOOTER, RANGER]);

    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await expect(officerRankRow(panel, CAPTAIN).getByText(REQUIRES_LIEUTENANT)).toBeVisible();
  });

  test('counts a selected officer perk on the Officer tab', async ({ page }) => {
    const panel = await openPanel(page);
    await selectPerks(panel, [MAGNUM, SHARPSHOOTER]);

    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await expect(panel.getByRole('tab', { name: OFFICER_TAB_WITH_ONE })).toBeVisible();
  });

  test('keeps the officer ranks above when the officer perk of a completed one is replaced', async ({ page }) => {
    const panel = await openPanel(page);
    await selectPerks(panel, [MAGNUM, SHARPSHOOTER, RANGER]);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);
    await abilityCell(panel, COVER_TACTICS).click();

    await abilityCell(panel, STAY_FROSTY).click();

    await expect(abilityCell(panel, COVER_TACTICS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('describes Commanding Officer under a Lieutenant perk', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await abilityCell(panel, STRENGTH_IN_NUMBERS).focus();

    await expect(description(panel).getByText(COMMANDING_OFFICER, { exact: true })).toBeVisible();
  });

  test('does not select an officer perk in a Read-only build', async ({ page }) => {
    const panel = await openPanel(page);
    await selectPerks(panel, [MAGNUM, SHARPSHOOTER]);
    await panel.getByRole('button', { name: LOCK_LABEL }).click();
    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await abilityCell(panel, STRENGTH_IN_NUMBERS).click({ force: true });

    await expect(abilityCell(panel, STRENGTH_IN_NUMBERS)).toHaveAttribute('aria-pressed', 'false');
  });
});
