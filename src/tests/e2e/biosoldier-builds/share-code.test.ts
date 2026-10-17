import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel, selectAbility } from '../utils/build-panel';
import { exportCode, importCode, toolbarImport } from '../utils/share-code';
import {
  BIOSOLDIER_CODE_TITLE,
  BROKEN_CODE,
  COPIED_LABEL,
  COPY_LABEL,
  COUNTERCHARGE,
  EXPORT_LABEL,
  EXPORTED_NAME,
  GENE_MODS_TAB,
  GENE_MODS_TAB_WITH_ONE,
  INVALID_CODE_ERROR,
  IRON_SKIN,
  MAGNUM,
  NOTIFICATIONS,
  PAGE_PATH,
  PANEL_NAME,
  PSIONIC_TAB,
  PSIONIC_TAB_WITH_ONE,
  RENAME_LABEL,
  REPLACE_LABEL,
  SHIV_CODE_TITLE,
  SHIV_PAGE_PATH,
  SHIV_PANEL_NAME,
} from './share-code.mock';

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
 * Selects a perk, a gene mod and a psionic ability in the tested build, renames it and returns its Share code.
 *
 * @param page browser page.
 */
const exportFilledBuild = async (page: Page) => {
  const panel = await openPanel(page);
  await abilityCell(panel, MAGNUM).click();
  await selectAbility(panel, GENE_MODS_TAB, IRON_SKIN);
  await selectAbility(panel, PSIONIC_TAB, COUNTERCHARGE);
  await panel.getByRole('textbox', { name: RENAME_LABEL }).fill(EXPORTED_NAME);
  await panel.getByRole('textbox', { name: RENAME_LABEL }).press('Enter');

  return exportCode(page, panel);
};

test.describe('Build imported from its Share code', () => {
  test('has the selected perks', async ({ page }) => {
    const code = await exportFilledBuild(page);

    await importCode(page, toolbarImport(page), code);

    await expect(abilityCell(classPanels(page).last(), MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('has the gene mods', async ({ page }) => {
    const code = await exportFilledBuild(page);

    await importCode(page, toolbarImport(page), code);

    await expect(classPanels(page).last().getByRole('tab', { name: GENE_MODS_TAB_WITH_ONE })).toBeVisible();
  });

  test('has the psionic abilities', async ({ page }) => {
    const code = await exportFilledBuild(page);

    await importCode(page, toolbarImport(page), code);

    await expect(classPanels(page).last().getByRole('tab', { name: PSIONIC_TAB_WITH_ONE })).toBeVisible();
  });

  test('has the name', async ({ page }) => {
    const code = await exportFilledBuild(page);

    await importCode(page, toolbarImport(page), code);

    await expect(classPanels(page).last().getByRole('textbox', { name: RENAME_LABEL })).toHaveValue(EXPORTED_NAME);
  });
});

test.describe('Share code export', () => {
  test('confirms copying the code', async ({ page }) => {
    const panel = await openPanel(page);
    await panel.getByRole('button', { name: EXPORT_LABEL }).click();

    await page.getByRole('dialog').getByRole('button', { name: COPY_LABEL }).click();

    await expect(page.getByRole('dialog').getByRole('button', { name: COPIED_LABEL })).toBeVisible();
  });
});

test.describe('Build replaced with a Share code', () => {
  test('takes the build of the code', async ({ page }) => {
    const panel = await openPanel(page);
    await abilityCell(panel, MAGNUM).click();
    const code = await exportCode(page, panel);
    await abilityCell(panel, MAGNUM).click();

    await importCode(page, panel.getByRole('button', { name: REPLACE_LABEL }), code);

    await expect(abilityCell(panel, MAGNUM)).toHaveAttribute('aria-pressed', 'true');
  });

  test('adds no build', async ({ page }) => {
    const panel = await openPanel(page);
    const code = await exportCode(page, panel);

    await importCode(page, panel.getByRole('button', { name: REPLACE_LABEL }), code);

    await expect(classPanels(page)).toHaveCount(1);
  });
});

test.describe('Broken Share code', () => {
  test('is reported in the import form', async ({ page }) => {
    await openPanel(page);

    await importCode(page, toolbarImport(page), BROKEN_CODE);

    await expect(page.getByRole('dialog').getByRole('alert')).toHaveText(INVALID_CODE_ERROR);
  });

  test('stops being reported once the code is edited', async ({ page }) => {
    await openPanel(page);
    await importCode(page, toolbarImport(page), BROKEN_CODE);

    await page.getByRole('dialog').getByRole('textbox').press('x');

    await expect(page.getByRole('dialog').getByRole('alert')).toHaveCount(0);
  });

  test('adds no build', async ({ page }) => {
    await openPanel(page);

    await importCode(page, toolbarImport(page), BROKEN_CODE);

    await expect(classPanels(page)).toHaveCount(1);
  });
});

test.describe('Share code of another unit', () => {
  test('of a SHIV build is reported in the Biosoldier calculator', async ({ page }) => {
    const shivPanel = await openBuildPanel(page, SHIV_PAGE_PATH, SHIV_PANEL_NAME);
    const code = await exportCode(page, shivPanel);
    await openPanel(page);

    await importCode(page, toolbarImport(page), code);

    await expect(page.getByRole('region', { name: NOTIFICATIONS }).getByText(SHIV_CODE_TITLE)).toBeVisible();
  });

  test('of a Biosoldier build is reported in the SHIV calculator', async ({ page }) => {
    const panel = await openPanel(page);
    const code = await exportCode(page, panel);
    await openBuildPanel(page, SHIV_PAGE_PATH, SHIV_PANEL_NAME);

    await importCode(page, toolbarImport(page), code);

    await expect(page.getByRole('region', { name: NOTIFICATIONS }).getByText(BIOSOLDIER_CODE_TITLE)).toBeVisible();
  });

  test('disappears once closed', async ({ page }) => {
    const shivPanel = await openBuildPanel(page, SHIV_PAGE_PATH, SHIV_PANEL_NAME);
    const code = await exportCode(page, shivPanel);
    await openPanel(page);
    await importCode(page, toolbarImport(page), code);
    const notifications = page.getByRole('region', { name: NOTIFICATIONS });

    await notifications.getByRole('button', { name: 'Close' }).click();

    await expect(notifications.getByText(SHIV_CODE_TITLE)).toHaveCount(0);
  });
});
