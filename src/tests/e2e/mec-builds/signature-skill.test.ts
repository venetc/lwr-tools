import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { navSignatureSkillIcon, openBuildPanel, selectSignatureSkill } from '../utils/build-panel';
import { exportCode, importCode, toolbarImport } from '../utils/share-code';
import { PAGE_PATH, PANEL_NAME, SPRINTER, SPRINTER_LABEL } from './signature-skill.mock';

/**
 * Opens the MEC Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Opens the tested build and sets Sprinter as its Signature skill.
 *
 * @param page browser page.
 */
const openPanelWithSignatureSkill = async (page: Page) => {
  const panel = await openPanel(page);
  await selectSignatureSkill(page, panel, SPRINTER);

  return panel;
};

test.describe('Signature skill of a MEC build', () => {
  test('shows the perk saved in the dialog', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);

    await expect(panel.getByRole('button', { name: SPRINTER_LABEL, exact: true })).toBeVisible();
  });

  test('is kept after a reload', async ({ page }) => {
    await openPanelWithSignatureSkill(page);

    const panel = await openPanel(page);

    await expect(panel.getByRole('button', { name: SPRINTER_LABEL, exact: true })).toBeVisible();
  });

  test('comes with a build imported from its Share code', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);
    const code = await exportCode(page, panel);

    await importCode(page, toolbarImport(page), code);

    await expect(page.getByRole('region', { name: PANEL_NAME }).last().getByRole('button', { name: SPRINTER_LABEL, exact: true })).toBeVisible();
  });

  test('shows the perk in the build navigation', async ({ page }) => {
    await openPanelWithSignatureSkill(page);

    await expect(navSignatureSkillIcon(page, PANEL_NAME, SPRINTER)).toHaveAttribute('title', SPRINTER);
  });
});
