import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openBuildPanel, selectAbility } from '../utils/build-panel';
import { textColor } from '../utils/css-color';
import {
  COUNTERCHARGE,
  GENE_MODS_TAB,
  IRON_SKIN,
  LOCK_LABEL,
  MEC_PAGE_PATH,
  MEC_PANEL_NAME,
  NAVIGATION,
  OTHER_PANEL_NAME,
  PAGE_PATH,
  PANEL_NAME,
  PSIONIC_TAB,
} from './class-icon.mock';

/**
 * Class icon copies of the first build with the name in the build navigation: one, or two halves for both branches.
 *
 * @param page browser page.
 * @param buildName build name in the navigation.
 */
const navIcons = (page: Page, buildName: string) => page
  .getByRole('navigation', { name: NAVIGATION })
  .getByRole('button', { name: buildName, exact: true })
  .first()
  .locator('svg');

/**
 * Class icon copies in the panel header: the first icons of the panel, one, or two halves for both branches.
 *
 * @param panel build panel.
 */
const headerIcons = (panel: Locator) => panel.locator('svg');

/**
 * Panel of the other build used as a colour reference.
 *
 * @param page browser page.
 */
const otherPanel = (page: Page) => page.getByRole('region', { name: OTHER_PANEL_NAME }).first();

test.describe('Class icon of a biosoldier build', () => {
  test('changes colour in the navigation once a gene mod is selected', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    const plainColor = await textColor(navIcons(page, PANEL_NAME).first());

    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    await expect.poll(() => textColor(navIcons(page, PANEL_NAME).first())).not.toBe(plainColor);
  });

  test('has the colour of the navigation icon in the panel header', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);

    const navColor = await textColor(navIcons(page, PANEL_NAME).first());

    await expect.poll(() => textColor(headerIcons(panel).first())).toBe(navColor);
  });

  test('changes colour in the navigation once a psionic ability is selected', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    const plainColor = await textColor(navIcons(page, PANEL_NAME).first());

    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);

    await expect.poll(() => textColor(navIcons(page, PANEL_NAME).first())).not.toBe(plainColor);
  });

  test('differs between gene mods and psionic abilities', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);
    await selectAbility(otherPanel(page), PSIONIC_TAB, COUNTERCHARGE);

    const geneModColor = await textColor(navIcons(page, PANEL_NAME).first());

    await expect.poll(() => textColor(navIcons(page, OTHER_PANEL_NAME).first())).not.toBe(geneModColor);
  });

  test('has the gene mod colour in the first half with both branches', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);
    await selectAbility(otherPanel(page), GENE_MODS_TAB, IRON_SKIN);

    const geneModColor = await textColor(navIcons(page, OTHER_PANEL_NAME).first());

    await expect.poll(() => textColor(navIcons(page, PANEL_NAME).first())).toBe(geneModColor);
  });

  test('has the psionic colour in the second half with both branches', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);
    await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);
    await selectAbility(otherPanel(page), PSIONIC_TAB, COUNTERCHARGE);

    const psionicColor = await textColor(navIcons(page, OTHER_PANEL_NAME).first());

    await expect.poll(() => textColor(navIcons(page, PANEL_NAME).nth(1))).toBe(psionicColor);
  });

  test('keeps the branch colour of a Read-only build', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);
    const geneModColor = await textColor(navIcons(page, PANEL_NAME).first());

    await panel.getByRole('button', { name: LOCK_LABEL }).click();

    await expect.poll(() => textColor(headerIcons(panel).first())).toBe(geneModColor);
  });
});

test.describe('Class icon of a MEC build', () => {
  test('has the colour of a plain biosoldier build', async ({ page }) => {
    await openBuildPanel(page, PAGE_PATH, PANEL_NAME);
    const plainColor = await textColor(navIcons(page, PANEL_NAME).first());

    await openBuildPanel(page, MEC_PAGE_PATH, MEC_PANEL_NAME);

    await expect.poll(() => textColor(navIcons(page, MEC_PANEL_NAME).first())).toBe(plainColor);
  });
});
