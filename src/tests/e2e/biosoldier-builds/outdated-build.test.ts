import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel, removeBuild } from '../utils/build-panel';
import type { SeededBuild } from '../utils/build-storage';
import { seedBuilds } from '../utils/build-storage';
import {
  AWAKENED,
  CANCEL_LABEL,
  CORPORAL,
  EXPORT_LABEL,
  IMPORT_LABEL,
  KEPT_PERKS,
  LANCE_CORPORAL,
  LOCK_LABEL,
  LONE_WOLF,
  MAGNUM,
  NAVIGATION,
  OLD_LABEL,
  OUTDATED_BUILD,
  OUTDATED_CHIP,
  OUTDATED_MARK,
  OUTDATED_NOTE,
  PAGE_PATH,
  PANEL_NAME,
  PSI_MASTERY,
  PSIONIC_TAB,
  READONLY_OUTDATED_BUILD,
  RESET_LABEL,
  SHARPSHOOTER,
  STORAGE_PREFIX,
  UPDATE_CARD_TEXTS,
  UPDATE_DIALOG,
  UPDATE_LABEL,
} from './outdated-build.mock';

/**
 * Opens, or reopens, the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Seeds the build and opens the Biosoldier Build calculator with it.
 *
 * @param page browser page.
 * @param build stored build record.
 */
const openSeededPanel = async (page: Page, build: SeededBuild) => {
  await seedBuilds(page, STORAGE_PREFIX, [build]);

  return openPanel(page);
};

/**
 * Cell of an ability on the step of the visible tab, such as a perk on a rank of the Class tree.
 *
 * @param panel build panel.
 * @param stepName step name.
 * @param abilityName ability name.
 */
const stepCell = (panel: Locator, stepName: string, abilityName: string) => panel.getByRole('group', { name: stepName, exact: true }).getByRole('button', { name: abilityName, exact: true });

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

test.describe('Outdated Biosoldier build', () => {
  test('is marked in the build navigation', async ({ page }) => {
    await openSeededPanel(page, OUTDATED_BUILD);

    await expect(page.getByRole('navigation', { name: NAVIGATION }).getByRole('img', { name: OUTDATED_MARK })).toBeVisible();
  });

  test('shows the count of its Outdated selections', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByText(OUTDATED_CHIP)).toBeVisible();
  });

  test('shows the perk of the code in the cell of its variant marked OLD', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(stepCell(panel, LANCE_CORPORAL, SHARPSHOOTER)).toContainText(OLD_LABEL);
  });

  test('shows the perk of the code selected', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(stepCell(panel, LANCE_CORPORAL, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'true');
  });

  test('shows the perk of the code in place of the current one', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(stepCell(panel, LANCE_CORPORAL, MAGNUM)).toHaveCount(0);
  });

  test('keeps the other selections selected', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(abilityCell(panel, LONE_WOLF)).toHaveAttribute('aria-pressed', 'true');
  });

  test('marks an outdated psionic ability', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await expect(stepCell(panel, AWAKENED, PSI_MASTERY)).toContainText(OLD_LABEL);
  });

  test('notes what the current tree has in the cell', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await stepCell(panel, LANCE_CORPORAL, SHARPSHOOTER).focus();

    await expect(description(panel)).toContainText(OUTDATED_NOTE);
  });

  test('takes no selection', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await stepCell(panel, CORPORAL, SHARPSHOOTER).click({ force: true });

    await expect(stepCell(panel, CORPORAL, SHARPSHOOTER)).toHaveAttribute('aria-pressed', 'false');
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

  test('offers no import', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await expect(panel.getByRole('button', { name: IMPORT_LABEL })).toHaveCount(0);
  });

  test('can be removed', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await removeBuild(panel);

    await expect(page.getByRole('region', { name: PANEL_NAME })).toHaveCount(0);
  });

  test('stays outdated after a reload', async ({ page }) => {
    await openSeededPanel(page, OUTDATED_BUILD);

    const reopened = await openPanel(page);

    await expect(reopened.getByText(OUTDATED_CHIP)).toBeVisible();
  });
});

test.describe('Update of an Outdated Biosoldier build', () => {
  test('shows a card with an empty cell for each Outdated selection', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await openUpdate(panel);

    await expect(updateDialog(page).getByRole('listitem')).toHaveText(UPDATE_CARD_TEXTS);
  });

  test('keeps the build outdated on Cancel', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await openUpdate(panel);

    await updateDialog(page).getByRole('button', { name: CANCEL_LABEL, exact: true }).click();

    await expect(panel.getByText(OUTDATED_CHIP)).toBeVisible();
  });

  test('clears the Outdated selections on Update', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await updateBuild(page, panel);

    await expect(stepCell(panel, LANCE_CORPORAL, SHARPSHOOTER)).toHaveCount(0);
  });

  for (const { rank, perk } of KEPT_PERKS) {
    test(`keeps ${perk} on ${rank} on Update`, async ({ page }) => {
      const panel = await openSeededPanel(page, OUTDATED_BUILD);

      await updateBuild(page, panel);

      await expect(stepCell(panel, rank, perk)).toHaveAttribute('aria-pressed', 'true');
    });
  }

  test('makes the build editable on Update', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await updateBuild(page, panel);

    await stepCell(panel, LANCE_CORPORAL, MAGNUM).click();

    await expect(stepCell(panel, LANCE_CORPORAL, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('removes the mark from the build navigation on Update', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);

    await updateBuild(page, panel);

    await expect(page.getByRole('navigation', { name: NAVIGATION }).getByRole('img', { name: OUTDATED_MARK })).toHaveCount(0);
  });

  test('saves the updated build', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    await updateBuild(page, panel);

    const reopened = await openPanel(page);

    await expect(reopened.getByText(OUTDATED_CHIP)).toHaveCount(0);
  });

  test('shows the update in another tab', async ({ page }) => {
    const panel = await openSeededPanel(page, OUTDATED_BUILD);
    const otherPanel = await openPanel(await page.context().newPage());

    await updateBuild(page, panel);

    await expect(otherPanel.getByText(OUTDATED_CHIP)).toHaveCount(0);
  });

  test('keeps a readonly build readonly', async ({ page }) => {
    const panel = await openSeededPanel(page, READONLY_OUTDATED_BUILD);

    await updateBuild(page, panel);

    await expect(panel.getByRole('button', { name: LOCK_LABEL })).toHaveAttribute('aria-pressed', 'true');
  });
});
