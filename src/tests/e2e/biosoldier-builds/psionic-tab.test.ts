import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel, selectAbility } from '../utils/build-panel';
import { textColor } from '../utils/css-color';
import {
  COUNTERCHARGE,
  GENE_MODS_TAB,
  GENE_MODS_TAB_WITH_ONE,
  IRON_SKIN,
  MIND_FRAY,
  NEURAL_DAMPING,
  NEURAL_DAMPING_NOTE,
  PAGE_PATH,
  PANEL_NAME,
  PSIONIC_COUNTER_WITH_ONE,
  PSIONIC_NOTE,
  PSIONIC_TAB,
  PSIONIC_TAB_WITH_ONE,
  SQUADSIGHT,
  TABS_SNAPSHOT,
} from './psionic-tab.mock';

/**
 * Opens the Biosoldier Build calculator with the default builds and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

test.describe('Psionic tab', () => {
  test('shows the Class tree, Gene mods, Psionic and Officer tabs with counters', async ({ page }) => {
    const panel = await openPanel(page);

    const tablist = panel.getByRole('tablist');

    await expect(tablist).toMatchAriaSnapshot(TABS_SNAPSHOT);
  });

  test('counts a selected psionic ability on the Psionic tab', async ({ page }) => {
    const panel = await openPanel(page);

    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);

    await expect(panel.getByRole('tab', { name: PSIONIC_TAB_WITH_ONE })).toBeVisible();
  });

  test('colours a psionic ability name in the description like the Psionic counter', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);

    const counterColor = await textColor(panel.getByRole('tab', { name: PSIONIC_TAB_WITH_ONE }).getByText(PSIONIC_COUNTER_WITH_ONE));

    await expect.poll(() => textColor(description(panel).getByText(COUNTERCHARGE, { exact: true }))).toBe(counterColor);
  });

  test('colours a psionic ability name in the description unlike a perk name', async ({ page }) => {
    const panel = await openPanel(page);
    const perkColor = await textColor(description(panel).getByText(SQUADSIGHT, { exact: true }));

    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await expect.poll(() => textColor(description(panel).getByText(COUNTERCHARGE, { exact: true }))).not.toBe(perkColor);
  });

  test('disables psionic abilities under Neural Damping', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, NEURAL_DAMPING);

    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await expect(abilityCell(panel, MIND_FRAY)).toHaveAttribute('aria-disabled', 'true');
  });

  test('describes a psionic ability blocked by Neural Damping with its note on hover', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, NEURAL_DAMPING);
    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await abilityCell(panel, MIND_FRAY).hover();

    await expect(description(panel).getByText(NEURAL_DAMPING_NOTE)).toBeVisible();
  });

  test('describes a psionic ability blocked by Neural Damping on focus', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, GENE_MODS_TAB, NEURAL_DAMPING);
    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();

    await abilityCell(panel, MIND_FRAY).focus();

    await expect(description(panel).getByText(MIND_FRAY, { exact: true })).toBeVisible();
  });

  test('describes Neural Damping blocked by psionic abilities with its note on tap', async ({ page, hasTouch }) => {
    test.skip(!hasTouch, 'Tap needs a touch screen');
    const panel = await openPanel(page);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await abilityCell(panel, NEURAL_DAMPING).tap({ force: true });

    await expect(description(panel).getByText(PSIONIC_NOTE)).toBeVisible();
  });

  test('keeps Neural Damping unselectable while psionic abilities are selected', async ({ page }) => {
    const panel = await openPanel(page);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);
    await panel.getByRole('tab', { name: GENE_MODS_TAB }).click();

    await abilityCell(panel, NEURAL_DAMPING).click({ force: true });

    await expect(panel.getByRole('tab', { name: GENE_MODS_TAB })).not.toHaveAccessibleName(GENE_MODS_TAB_WITH_ONE);
  });
});
