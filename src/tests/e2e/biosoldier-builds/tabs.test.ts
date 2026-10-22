import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel } from '../utils/build-panel';
import {
  CLASS_TREE_TAB,
  COUNTERCHARGE,
  GENE_MODS_TAB,
  MAGNUM,
  NEURAL_DAMPING,
  OFFICER_TAB,
  PAGE_PATH,
  PANEL_NAME,
  PSIONIC_TAB,
  STRENGTH_IN_NUMBERS,
} from './tabs.mock';

/**
 * Opens the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Height of the panel on the page.
 *
 * @param panel build panel.
 */
const panelHeight = async (panel: Locator) => (await panel.boundingBox())?.height ?? 0;

test.describe('Build panel tabs from the keyboard', () => {
  test('move to the next tab with the right arrow', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('tab', { name: CLASS_TREE_TAB }).press('ArrowRight');

    await expect(panel.getByRole('tab', { name: GENE_MODS_TAB })).toHaveAttribute('aria-selected', 'true');
  });

  test('move to the previous tab with the left arrow', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();

    await panel.getByRole('tab', { name: GENE_MODS_TAB }).press('ArrowLeft');

    await expect(panel.getByRole('tab', { name: CLASS_TREE_TAB })).toHaveAttribute('aria-selected', 'true');
  });

  test('move to the last tab with End', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('tab', { name: CLASS_TREE_TAB }).press('End');

    await expect(panel.getByRole('tab', { name: OFFICER_TAB })).toHaveAttribute('aria-selected', 'true');
  });

  test('move to the first tab with Home', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await panel.getByRole('tab', { name: OFFICER_TAB }).press('Home');

    await expect(panel.getByRole('tab', { name: CLASS_TREE_TAB })).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('Switching build panel tabs', () => {
  test('describes the default gene mod of the Gene mods tab', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).focus();

    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();

    await expect(description(panel).getByText(NEURAL_DAMPING, { exact: true })).toBeVisible();
  });

  test('describes the default psionic ability of the Psionic tab', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).focus();

    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await expect(description(panel).getByText(COUNTERCHARGE, { exact: true })).toBeVisible();
  });

  test('describes the default officer perk of the Officer tab', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).focus();

    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await expect(description(panel).getByText(STRENGTH_IN_NUMBERS, { exact: true })).toBeVisible();
  });

  test('keeps the panel height on the Gene mods tab', async ({ page }) => {
    const panel = await openPanel(page);
    const classTreeHeight = await panelHeight(panel);

    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();

    await expect.poll(() => panelHeight(panel)).toBe(classTreeHeight);
  });

  test('keeps the panel height on the Psionic tab', async ({ page }) => {
    const panel = await openPanel(page);
    const classTreeHeight = await panelHeight(panel);

    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await expect.poll(() => panelHeight(panel)).toBe(classTreeHeight);
  });

  test('keeps the panel height on the Officer tab', async ({ page }) => {
    const panel = await openPanel(page);
    const classTreeHeight = await panelHeight(panel);

    await panel.getByRole('tab', { name: OFFICER_TAB }).click();

    await expect.poll(() => panelHeight(panel)).toBe(classTreeHeight);
  });
});
