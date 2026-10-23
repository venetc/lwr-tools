import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel, selectAbilities, selectAbility } from '../utils/build-panel';
import {
  CAPTAIN,
  CLASS_TREE_TAB,
  COMMANDING_OFFICER,
  COVER_TACTICS,
  LOCK_LABEL,
  LOCK_REASON,
  MAGNUM,
  OFFICER_TAB,
  OFFICER_TAB_WITH_ONE,
  PAGE_PATH,
  PANEL_NAME,
  REQUIRES_CORPORAL_IN_GAME,
  SHOW_EM_THE_ROPES,
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
 * Row of the officer rank on the Officer tab.
 *
 * @param panel build panel.
 * @param officerRankName officer rank name.
 */
const officerRankRow = (panel: Locator, officerRankName: string) => (
  panel.getByRole('listitem').filter({ has: panel.page().getByRole('group', { name: officerRankName, exact: true }) })
);

test.describe('Officer tab', () => {
  test('selects an officer perk with only the base perk in the Class tree', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await expect(abilityCell(panel, STRENGTH_IN_NUMBERS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('selects an officer perk on Captain with Lieutenant empty', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, OFFICER_TAB, COVER_TACTICS);

    await expect(abilityCell(panel, COVER_TACTICS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('shows no lock reason under an officer rank', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await expect(officerRankRow(panel, CAPTAIN).getByText(LOCK_REASON)).toHaveCount(0);
  });

  test('describes the rank the game requires for a Lieutenant perk', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await abilityCell(panel, STRENGTH_IN_NUMBERS).focus();

    await expect(description(panel).getByText(REQUIRES_CORPORAL_IN_GAME)).toBeVisible();
  });

  test('counts a selected officer perk on the Officer tab', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await expect(panel.getByRole('tab', { name: OFFICER_TAB_WITH_ONE })).toBeVisible();
  });

  test('keeps the officer ranks above when the officer perk of a completed one is replaced', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);
    await abilityCell(panel, COVER_TACTICS).click();

    await abilityCell(panel, STAY_FROSTY).click();

    await expect(abilityCell(panel, COVER_TACTICS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('keeps the officer ranks above when a middle officer rank is cleared', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbilities(panel, OFFICER_TAB, [STRENGTH_IN_NUMBERS, COVER_TACTICS, SHOW_EM_THE_ROPES]);

    await abilityCell(panel, COVER_TACTICS).click();

    await expect(abilityCell(panel, SHOW_EM_THE_ROPES)).toHaveAttribute('aria-pressed', 'true');
  });

  test('keeps the officer perks when a rank is cleared in the Class tree', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, CLASS_TREE_TAB, MAGNUM);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await selectAbility(panel, CLASS_TREE_TAB, MAGNUM);

    await expect(panel.getByRole('tab', { name: OFFICER_TAB_WITH_ONE })).toBeVisible();
  });

  test('describes Commanding Officer under a Lieutenant perk', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await abilityCell(panel, STRENGTH_IN_NUMBERS).focus();

    await expect(description(panel).getByText(COMMANDING_OFFICER, { exact: true })).toBeVisible();
  });

  test('does not select an officer perk in a Read-only build', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('button', { name: LOCK_LABEL }).click();
    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await abilityCell(panel, STRENGTH_IN_NUMBERS).click({ force: true });

    await expect(abilityCell(panel, STRENGTH_IN_NUMBERS)).toHaveAttribute('aria-pressed', 'false');
  });
});
