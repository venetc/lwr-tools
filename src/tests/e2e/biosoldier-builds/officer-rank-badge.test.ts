import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel, selectAbilities, selectAbility } from '../utils/build-panel';
import { textColor } from '../utils/css-color';
import {
  ANY_OFFICER_RANK,
  CAPTAIN,
  CAPTAIN_ABBREVIATION,
  CLASS_TREE_TAB,
  COVER_TACTICS,
  LIEUTENANT,
  LIEUTENANT_ABBREVIATION,
  MAGNUM,
  NAVIGATION,
  OFFICER_TAB,
  PAGE_PATH,
  PANEL_NAME,
  STRENGTH_IN_NUMBERS,
} from './officer-rank-badge.mock';

/**
 * Opens the Biosoldier Build calculator with the default builds and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Entry of the first build with the name in the build navigation.
 *
 * @param page browser page.
 */
const navEntry = (page: Page) => page
  .getByRole('navigation', { name: NAVIGATION })
  .getByRole('listitem')
  .filter({ has: page.getByRole('button', { name: PANEL_NAME, exact: true }) })
  .first();

/**
 * Officer rank badge in the panel header.
 *
 * @param panel build panel.
 * @param officerRankName accessible name of the badge.
 */
const headerBadge = (panel: Locator, officerRankName: string | RegExp) => panel.getByRole('img', { name: officerRankName });

test.describe('Officer rank badge', () => {
  test('shows Lieutenant in the panel header once an officer perk is selected', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await expect(headerBadge(panel, LIEUTENANT)).toHaveText(LIEUTENANT_ABBREVIATION);
  });

  test('shows Lieutenant in the build navigation once an officer perk is selected', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await expect(navEntry(page).getByRole('img', { name: LIEUTENANT })).toHaveText(LIEUTENANT_ABBREVIATION);
  });

  test('shows the senior officer rank', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await abilityCell(panel, COVER_TACTICS).click();

    await expect(headerBadge(panel, CAPTAIN)).toHaveText(CAPTAIN_ABBREVIATION);
  });

  test('shows the senior officer rank above an empty one', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, OFFICER_TAB, COVER_TACTICS);

    await expect(headerBadge(panel, CAPTAIN)).toHaveText(CAPTAIN_ABBREVIATION);
  });

  test('falls back to Lieutenant once Captain is cleared', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbilities(panel, OFFICER_TAB, [STRENGTH_IN_NUMBERS, COVER_TACTICS]);

    await abilityCell(panel, COVER_TACTICS).click();

    await expect(headerBadge(panel, LIEUTENANT)).toHaveText(LIEUTENANT_ABBREVIATION);
  });

  test('keeps Lieutenant once a rank is cleared in the Class tree', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, CLASS_TREE_TAB, MAGNUM);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await selectAbility(panel, CLASS_TREE_TAB, MAGNUM);

    await expect(headerBadge(panel, LIEUTENANT)).toHaveText(LIEUTENANT_ABBREVIATION);
  });

  test('is absent from a build without officer perks', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, CLASS_TREE_TAB, MAGNUM);

    await expect(headerBadge(panel, ANY_OFFICER_RANK)).toHaveCount(0);
  });

  test('is absent once the last officer perk is cleared', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);

    await abilityCell(panel, STRENGTH_IN_NUMBERS).click();

    await expect(navEntry(page).getByRole('img', { name: ANY_OFFICER_RANK })).toHaveCount(0);
  });

  test('keeps the colour of the class icon', async ({ page }) => {
    const panel = await openPanel(page);
    const plainColor = await textColor(navEntry(page).locator('svg').first());

    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);
    await navEntry(page).getByRole('img', { name: LIEUTENANT }).waitFor();

    expect(await textColor(navEntry(page).locator('svg').first())).toBe(plainColor);
  });
});
