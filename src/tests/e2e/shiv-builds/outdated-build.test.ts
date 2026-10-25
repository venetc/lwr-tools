import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel, removeBuild } from '../utils/build-panel';
import type { SeededBuild } from '../utils/build-storage';
import { seedBuilds } from '../utils/build-storage';
import {
  BASIC_CONFIG,
  CANCEL_LABEL,
  COLLISION_NOTE,
  EXPORT_LABEL,
  HOLO_ROUNDS,
  KEPT_PERKS,
  LOCK_LABEL,
  LOCK_N_LOAD,
  NAVIGATION,
  OLD_LABEL,
  OUTDATED_BUILD,
  OUTDATED_CHIP,
  OUTDATED_MARK,
  PAGE_PATH,
  PANEL_NAME,
  PLATFORM_STABILITY,
  READONLY_OUTDATED_BUILD,
  REMOVED_NOTE,
  REPAIR_SERVOS,
  RESET_LABEL,
  STORAGE_PREFIX,
  UPDATE_CARD_TEXT,
  UPDATE_DIALOG,
  UPDATE_LABEL,
} from './outdated-build.mock';

/**
 * Opens, or reopens, the SHIV Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Seeds the build and opens the SHIV Build calculator with it.
 *
 * @param page browser page.
 * @param build stored build record.
 */
const openSeededPanel = async (page: Page, build: SeededBuild) => {
  await seedBuilds(page, STORAGE_PREFIX, [build]);

  return openPanel(page);
};

/**
 * Cell of a perk on the technology level, such as Basic Config of the collision.
 *
 * @param panel build panel.
 * @param levelName technology level name.
 * @param perkName perk name.
 */
const technologyLevelCell = (panel: Locator, levelName: string, perkName: string) => panel.getByRole('group', { name: levelName, exact: true }).getByRole('button', { name: perkName, exact: true });

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
const openUpdate = (panel: Locator) => panel.getByRole('button', { name: UPDATE_LABEL, exact: true }).click();

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

test.describe('Outdated SHIV build', () => {
  test('is marked in the build navigation', async ({ page }) => {
    await openSeededPanel(page, OUTDATED_BUILD);

    await expect(page.getByRole('navigation', { name: NAVIGATION }).getByRole('img', { name: OUTDATED_MARK })).toBeVisible();
  });

  test('shows the count of its Outdated selections', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByText(OUTDATED_CHIP)).toBeVisible();
  });

  test('marks the first perk of the collision OLD', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(technologyLevelCell(panel, BASIC_CONFIG, LOCK_N_LOAD)).toContainText(OLD_LABEL);
  });

  test('marks the second perk of the collision OLD', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(technologyLevelCell(panel, BASIC_CONFIG, REPAIR_SERVOS)).toContainText(OLD_LABEL);
  });

  test('shows the first perk of the collision selected', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(technologyLevelCell(panel, BASIC_CONFIG, LOCK_N_LOAD)).toHaveAttribute('aria-pressed', 'true');
  });

  test('shows the second perk of the collision selected', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(technologyLevelCell(panel, BASIC_CONFIG, REPAIR_SERVOS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('leaves the other perk of the technology level unmarked', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(technologyLevelCell(panel, BASIC_CONFIG, PLATFORM_STABILITY)).not.toContainText(OLD_LABEL);
  });

  test('notes the collision in the description of a colliding perk', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await technologyLevelCell(panel, BASIC_CONFIG, REPAIR_SERVOS).focus();

    await expect(description(panel)).toContainText(COLLISION_NOTE);
  });

  test('keeps the other selections selected', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(abilityCell(panel, HOLO_ROUNDS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('lists no removed perk when every perk of the code is in the SHIV tree', async ({ page }) => {
    await openSeededPanel(page, OUTDATED_BUILD);

    await expect(page.getByText(REMOVED_NOTE)).toHaveCount(0);
  });

  test('takes no selection', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await technologyLevelCell(panel, BASIC_CONFIG, PLATFORM_STABILITY).click({ force: true });

    await expect(technologyLevelCell(panel, BASIC_CONFIG, PLATFORM_STABILITY)).toHaveAttribute('aria-pressed', 'false');
  });

  test('takes no new name', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByRole('textbox')).toHaveAttribute('readonly', '');
  });

  test('offers no export', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByRole('button', { name: EXPORT_LABEL })).toHaveCount(0);
  });

  test('offers no lock toggle', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByRole('button', { name: LOCK_LABEL })).toHaveCount(0);
  });

  test('offers no reset', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByRole('button', { name: RESET_LABEL })).toHaveCount(0);
  });

  test('can be removed', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await removeBuild(panel);

    await expect(page.getByRole('region', { name: PANEL_NAME })).toHaveCount(0);
  });
});

test.describe('Update of an Outdated SHIV build', () => {
  test('shows a card with both perks of the collision and an empty cell', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await openUpdate(panel);

    await expect(updateDialog(page).getByRole('listitem')).toHaveText([UPDATE_CARD_TEXT]);
  });

  test('keeps the build outdated on Cancel', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await openUpdate(panel);

    await updateDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(panel.getByText(OUTDATED_CHIP)).toBeVisible();
  });

  test('clears the perks of the collision on Update', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await updateBuild(page, panel);

    await expect(technologyLevelCell(panel, BASIC_CONFIG, LOCK_N_LOAD)).toHaveAttribute('aria-pressed', 'false');
  });

  for (const { level, perk } of KEPT_PERKS) {
    test(`keeps ${perk} on ${level} on Update`, async ({ page }) => {
      const panel = await openSeededPanel(page, OUTDATED_BUILD);

      await updateBuild(page, panel);

      await expect(technologyLevelCell(panel, level, perk)).toHaveAttribute('aria-pressed', 'true');
    });
  }

  test('makes the build editable on Update', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await updateBuild(page, panel);

    await technologyLevelCell(panel, BASIC_CONFIG, REPAIR_SERVOS).click();

    await expect(technologyLevelCell(panel, BASIC_CONFIG, REPAIR_SERVOS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('saves the updated build', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await updateBuild(page, panel);

    const reopened = await openPanel(page);

    await expect(reopened.getByText(OUTDATED_CHIP)).toHaveCount(0);
  });

  test('keeps a readonly build readonly', async ({ page }) => {
    const panel = await openSeededPanel(page, READONLY_OUTDATED_BUILD);

    await updateBuild(page, panel);

    await expect(panel.getByRole('button', { name: LOCK_LABEL })).toHaveAttribute('aria-pressed', 'true');
  });
});
