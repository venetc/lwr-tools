import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel, selectAbility } from '../utils/build-panel';
import {
  COUNTERCHARGE,
  GENE_MODS_TAB,
  GENE_MODS_TAB_WITH_ONE,
  IRON_SKIN,
  LOCK_LABEL,
  MAGNUM,
  NEW_NAME,
  PAGE_PATH,
  PANEL_NAME,
  PSIONIC_TAB,
  PSIONIC_TAB_WITH_ONE,
  RENAME_LABEL,
} from './persistence.mock';

/**
 * Opens, or reopens, the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

test.describe('Biosoldier build after a reload', () => {
  test('keeps a selected perk', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).click();

    const reopened = await openPanel(page);

    await expect(abilityCell(reopened, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('keeps a selected gene mod', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    const reopened = await openPanel(page);

    await expect(reopened.getByRole('tab', { name: GENE_MODS_TAB_WITH_ONE })).toBeVisible();
  });

  test('keeps a selected psionic ability', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);

    const reopened = await openPanel(page);

    await expect(reopened.getByRole('tab', { name: PSIONIC_TAB_WITH_ONE })).toBeVisible();
  });

  test('keeps the name', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('textbox', { name: RENAME_LABEL }).fill(NEW_NAME);
    await panel.getByRole('textbox', { name: RENAME_LABEL }).press('Enter');

    const reopened = await openPanel(page);

    await expect(reopened.getByRole('textbox', { name: RENAME_LABEL })).toHaveValue(NEW_NAME);
  });

  test('keeps the lock', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('button', { name: LOCK_LABEL }).click();

    const reopened = await openPanel(page);

    await expect(reopened.getByRole('button', { name: LOCK_LABEL })).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('Biosoldier build in two browser tabs', () => {
  test('shows a perk selected in one tab in the other', async ({ page }) => {
    const panel = await openPanel(page);
    const otherPanel = await openPanel(await page.context().newPage());

    await abilityCell(panel, MAGNUM).click();

    await expect(abilityCell(otherPanel, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('shows a gene mod selected in one tab in the other', async ({ page }) => {
    const panel = await openPanel(page);
    const otherPanel = await openPanel(await page.context().newPage());

    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await expect(otherPanel.getByRole('tab', { name: GENE_MODS_TAB_WITH_ONE })).toBeVisible();
  });

  test('shows a psionic ability selected in one tab in the other', async ({ page }) => {
    const panel = await openPanel(page);
    const otherPanel = await openPanel(await page.context().newPage());

    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);

    await expect(otherPanel.getByRole('tab', { name: PSIONIC_TAB_WITH_ONE })).toBeVisible();
  });
});

test.describe('Default builds', () => {
  test('are created once when the calculator is opened again', async ({ page }) => {
    await openPanel(page);

    await openPanel(page);

    await expect(page.getByRole('region', { name: PANEL_NAME })).toHaveCount(1);
  });

  test('are created once when two tabs open the calculator at once', async ({ page }) => {
    const otherPage = await page.context().newPage();
    await Promise.all([openPanel(page), openPanel(otherPage)]);

    await openPanel(page);

    await expect(page.getByRole('region', { name: PANEL_NAME })).toHaveCount(1);
  });
});
