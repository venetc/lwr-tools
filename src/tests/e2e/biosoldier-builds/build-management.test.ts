import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, addBuild, openBuildPanel, resetBuild } from '../utils/build-panel';
import {
  COUNTERCHARGE,
  EXTRA_BUILD_COUNT,
  GENE_MODS_TAB,
  IRON_SKIN,
  LOCK_LABEL,
  MAGNUM,
  NAVIGATION,
  NEW_NAME,
  PAGE_PATH,
  PANEL_NAME,
  PSIONIC_TAB,
  REMOVE_HOLD_TIME,
  REMOVE_LABEL,
  RENAME_LABEL,
  RESET_LABEL,
} from './build-management.mock';

/**
 * Opens the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Builds of the tested Class.
 *
 * @param page browser page.
 */
const classPanels = (page: Page) => page.getByRole('region', { name: PANEL_NAME });

/**
 * Locks the build.
 *
 * @param panel build panel.
 */
const lockBuild = (panel: Locator) => panel.getByRole('button', { name: LOCK_LABEL }).click();

test.describe('Build management', () => {
  test('adds a build of the Class', async ({ page }) => {
    await openPanel(page);

    await addBuild(page, PANEL_NAME);

    await expect(classPanels(page)).toHaveCount(2);
  });

  test('shows a new name in the build navigation', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('textbox', { name: RENAME_LABEL }).fill(NEW_NAME);

    await expect(page.getByRole('navigation', { name: NAVIGATION }).getByRole('button', { name: NEW_NAME, exact: true })).toBeVisible();
  });

  test('removes a build', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('button', { name: REMOVE_LABEL }).click({ delay: REMOVE_HOLD_TIME });

    await expect(classPanels(page)).toHaveCount(0);
  });

  test('keeps a build clicked without holding', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('button', { name: REMOVE_LABEL }).click();

    await expect(classPanels(page)).toHaveCount(1);
  });

  test('scrolls to a build chosen in the build navigation', async ({ page }) => {
    await openPanel(page);
    for (let index = 0; index < EXTRA_BUILD_COUNT; index++) await addBuild(page, PANEL_NAME);
    await page.evaluate(() => window.scrollTo(0, 0));

    await page.getByRole('navigation', { name: NAVIGATION }).getByRole('button', { name: PANEL_NAME, exact: true }).last().click();

    await expect(classPanels(page).last()).toBeInViewport({ ratio: 0.5 });
  });
});

test.describe('Build reset', () => {
  test('clears the selected perks', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).click();

    await resetBuild(panel);

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'false');
  });

  test('clears the gene mods', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();
    await abilityCell(panel, IRON_SKIN).click();

    await resetBuild(panel);

    await expect(abilityCell(panel, IRON_SKIN)).toHaveAttribute('aria-pressed', 'false');
  });

  test('clears the psionic abilities', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();
    await abilityCell(panel, COUNTERCHARGE).click();

    await resetBuild(panel);

    await expect(abilityCell(panel, COUNTERCHARGE)).toHaveAttribute('aria-pressed', 'false');
  });

  test('keeps the build name', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('textbox', { name: RENAME_LABEL }).fill(NEW_NAME);

    await resetBuild(panel);

    await expect(panel.getByRole('textbox', { name: RENAME_LABEL })).toHaveValue(NEW_NAME);
  });

  test('keeps the selected perks when clicked without holding', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).click();

    await panel.getByRole('button', { name: RESET_LABEL }).click();

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('Locked build', () => {
  test('does not select a perk', async ({ page }) => {
    const panel = await openPanel(page);
    await lockBuild(panel);

    await abilityCell(panel, MAGNUM).click({ force: true });

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'false');
  });

  test('does not select a gene mod', async ({ page }) => {
    const panel = await openPanel(page);
    await lockBuild(panel);
    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();

    await abilityCell(panel, IRON_SKIN).click({ force: true });

    await expect(abilityCell(panel, IRON_SKIN)).toHaveAttribute('aria-pressed', 'false');
  });

  test('does not select a psionic ability', async ({ page }) => {
    const panel = await openPanel(page);
    await lockBuild(panel);
    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await abilityCell(panel, COUNTERCHARGE).click({ force: true });

    await expect(abilityCell(panel, COUNTERCHARGE)).toHaveAttribute('aria-pressed', 'false');
  });

  test('still switches tabs', async ({ page }) => {
    const panel = await openPanel(page);
    await lockBuild(panel);

    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();

    await expect(panel.getByRole('tab', { name: GENE_MODS_TAB })).toHaveAttribute('aria-selected', 'true');
  });

  test('selects again once unlocked', async ({ page }) => {
    const panel = await openPanel(page);
    await lockBuild(panel);
    await lockBuild(panel);

    await abilityCell(panel, MAGNUM).click();

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('cannot be removed', async ({ page }) => {
    const panel = await openPanel(page);

    await lockBuild(panel);

    await expect(panel.getByRole('button', { name: REMOVE_LABEL })).toHaveCount(0);
  });

  test('cannot be reset', async ({ page }) => {
    const panel = await openPanel(page);

    await lockBuild(panel);

    await expect(panel.getByRole('button', { name: RESET_LABEL })).toHaveCount(0);
  });
});
