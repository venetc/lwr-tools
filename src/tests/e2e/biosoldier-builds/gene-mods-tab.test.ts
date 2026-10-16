import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel, selectAbility } from '../utils/build-panel';
import { textColor } from '../utils/css-color';
import {
  ENHANCED_METABOLISM,
  GENE_MODS_COUNTER_WITH_ONE,
  GENE_MODS_TAB,
  GENE_MODS_TAB_WITH_ONE,
  IRON_SKIN,
  NEURAL_DAMPING,
  PAGE_PATH,
  PANEL_NAME,
  REGENESIS,
  SMART_MACROPHAGES,
  SQUADSIGHT,
} from './gene-mods-tab.mock';

/**
 * Opens the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

test.describe('Gene mods tab', () => {
  test('selects a gene mod', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await expect(abilityCell(panel, IRON_SKIN)).toHaveAttribute('aria-pressed', 'true');
  });

  test('counts a selected gene mod on the tab', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await expect(panel.getByRole('tab', { name: GENE_MODS_TAB_WITH_ONE })).toBeVisible();
  });

  test('replaces the gene mod of a body part with the other one', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await abilityCell(panel, ENHANCED_METABOLISM).click();

    await expect(abilityCell(panel, IRON_SKIN)).toHaveAttribute('aria-pressed', 'false');
  });

  test('clears a body part when the selected gene mod is clicked', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await abilityCell(panel, IRON_SKIN).click();

    await expect(abilityCell(panel, IRON_SKIN)).toHaveAttribute('aria-pressed', 'false');
  });

  test('keeps the gene mods of other body parts', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, REGENESIS);

    await abilityCell(panel, SMART_MACROPHAGES).click();

    await expect(abilityCell(panel, REGENESIS)).toHaveAttribute('aria-pressed', 'true');
  });

  test('colours a gene mod name in the description like the Gene mods counter', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    const counterColor = await textColor(panel.getByRole('tab', { name: GENE_MODS_TAB_WITH_ONE }).getByText(GENE_MODS_COUNTER_WITH_ONE));

    await expect.poll(() => textColor(description(panel).getByText(IRON_SKIN, { exact: true }))).toBe(counterColor);
  });

  test('colours a gene mod name in the description unlike a perk name', async ({ page }) => {
    const panel = await openPanel(page);
    const perkColor = await textColor(description(panel).getByText(SQUADSIGHT, { exact: true }));

    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();

    await expect.poll(() => textColor(description(panel).getByText(NEURAL_DAMPING, { exact: true }))).not.toBe(perkColor);
  });
});
