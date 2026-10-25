import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel } from '../utils/build-panel';
import type { SeededBuild } from '../utils/build-storage';
import { seedBuilds } from '../utils/build-storage';
import {
  CANCEL_LABEL,
  EXPORT_LABEL,
  KEPT_PERKS,
  LANCE_CORPORAL,
  LOCK_LABEL,
  LONE_WOLF,
  NAVIGATION,
  OLD_LABEL,
  OUTDATED_BUILD,
  OUTDATED_MARK,
  OUTDATED_NOTE,
  OUTDATED_UPDATE_LABEL,
  PAGE_PATH,
  PANEL_NAME,
  RAPID_FIRE,
  READONLY_OUTDATED_BUILD,
  SHARPSHOOTER,
  STORAGE_PREFIX,
  UPDATE_CARD_TEXT,
  UPDATE_DIALOG,
  UPDATE_LABEL,
} from './outdated-build.mock';

/**
 * Opens, or reopens, the MEC Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Seeds the build and opens the MEC Build calculator with it.
 *
 * @param page browser page.
 * @param build stored build record.
 */
const openSeededPanel = async (page: Page, build: SeededBuild) => {
  await seedBuilds(page, STORAGE_PREFIX, [build]);

  return openPanel(page);
};

/**
 * Cell of a perk on the rank of the Class tree.
 *
 * @param panel build panel.
 * @param rankName rank name.
 * @param perkName perk name.
 */
const rankCell = (panel: Locator, rankName: string, perkName: string) => panel.getByRole('group', { name: rankName, exact: true }).getByRole('button', { name: perkName, exact: true });

/**
 * The «Update build» dialog.
 *
 * @param page browser page.
 */
const updateDialog = (page: Page) => page.getByRole('dialog', { name: UPDATE_DIALOG });

/**
 * Opens the «Update build» dialog of the panel.
 *
 * @param panel build panel.
 */
const openUpdate = (panel: Locator) => panel.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true }).click();

/**
 * Opens the «Update build» dialog of the panel and confirms it.
 *
 * @param page browser page.
 * @param panel build panel.
 */
const updateBuild = async (page: Page, panel: Locator) => {
  await openUpdate(panel);
  await updateDialog(page).getByRole('button', { name: UPDATE_LABEL, exact: true }).click();
};

test.describe('Outdated MEC build', () => {
  test('is marked in the build navigation', async ({ page }) => {
    await openSeededPanel(page, OUTDATED_BUILD);

    await expect(page.getByRole('navigation', { name: NAVIGATION }).getByRole('img', { name: OUTDATED_MARK })).toBeVisible();
  });

  test('shows the count of its Outdated selections', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true })).toBeVisible();
  });

  test('shows the perk of the code in the cell of its variant marked OLD', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(rankCell(panel, LANCE_CORPORAL, SHARPSHOOTER)).toContainText(OLD_LABEL);
  });

  test('shows the perk of the code selected', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(rankCell(panel, LANCE_CORPORAL, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'true');
  });

  test('notes what the current tree has in the cell', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await rankCell(panel, LANCE_CORPORAL, SHARPSHOOTER).focus();

    await expect(description(panel)).toContainText(OUTDATED_NOTE);
  });

  test('takes no selection', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await abilityCell(panel, LONE_WOLF).click({ force: true });

    await expect(abilityCell(panel, LONE_WOLF)).toHaveAttribute('aria-pressed', 'true');
  });

  test('offers no export', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByRole('button', { name: EXPORT_LABEL })).toHaveCount(0);
  });
});

test.describe('Update of an Outdated MEC build', () => {
  test('shows a card with an empty cell', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await openUpdate(panel);

    await expect(updateDialog(page).getByRole('listitem')).toHaveText([UPDATE_CARD_TEXT]);
  });

  test('keeps the build outdated on Cancel', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await openUpdate(panel);

    await updateDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(panel.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true })).toBeVisible();
  });

  for (const { rank, perk } of KEPT_PERKS) {
    test(`keeps ${perk} on ${rank} on Update`, async ({ page }) => {
      const panel = await openSeededPanel(page, OUTDATED_BUILD);

      await updateBuild(page, panel);

      await expect(rankCell(panel, rank, perk)).toHaveAttribute('aria-pressed', 'true');
    });
  }

  test('makes the build editable on Update', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await updateBuild(page, panel);

    await rankCell(panel, LANCE_CORPORAL, RAPID_FIRE).click();

    await expect(rankCell(panel, LANCE_CORPORAL, RAPID_FIRE)).toHaveAttribute('aria-pressed', 'true');
  });

  test('saves the updated build', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await updateBuild(page, panel);

    const reopened = await openPanel(page);

    await expect(reopened.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true })).toHaveCount(0);
  });

  test('keeps a readonly build readonly', async ({ page }) => {
    const panel = await openSeededPanel(page, READONLY_OUTDATED_BUILD);

    await updateBuild(page, panel);

    await expect(panel.getByRole('button', { name: LOCK_LABEL })).toHaveAttribute('aria-pressed', 'true');
  });
});
