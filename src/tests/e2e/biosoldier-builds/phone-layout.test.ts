import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, description, openBuildPanel } from '../utils/build-panel';
import { pageOverflow } from '../utils/page-layout';
import { toolbarImport } from '../utils/share-code';
import { MAGNUM, NAVIGATION, PAGE_PATH, PANEL_NAME } from './phone-layout.mock';

/**
 * Opens the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

test.describe('Biosoldier calculator on a phone', () => {
  test.skip(({ isMobile }) => !isMobile, 'Phone layout only');

  test('fits the build panel tabs in one line', async ({ page }) => {
    const panel = await openPanel(page);

    const tabTops = await panel.getByRole('tab').evaluateAll(tabs => tabs.map(tab => Math.round(tab.getBoundingClientRect().top)));

    expect(new Set(tabTops).size).toBe(1);
  });

  test('has no horizontal scroll', async ({ page }) => {
    await openPanel(page);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('describes a tapped cell', async ({ page }) => {
    const panel = await openPanel(page);

    await abilityCell(panel, MAGNUM).tap();

    await expect(description(panel).getByText(MAGNUM, { exact: true })).toBeVisible();
  });

  test('clears a perk tapped again', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).tap();

    await abilityCell(panel, MAGNUM).tap();

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'false');
  });

  test('shows the build navigation', async ({ page }) => {
    await openPanel(page);

    const navigation = page.getByRole('navigation', { name: NAVIGATION });

    await expect(navigation).toBeVisible();
  });

  test('shows the import button', async ({ page }) => {
    await openPanel(page);

    const importButton = toolbarImport(page);

    await expect(importButton).toBeVisible();
  });
});
