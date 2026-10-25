import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import {
  buildNavItem,
  navBuildName,
  navSignatureSkillIcon,
  openBuildPanel,
  resetBuild,
  selectSignatureSkill,
  signatureSkillButton,
  signatureSkillDialog,
  signatureSkillTile,
} from '../utils/build-panel';
import { seedBuilds } from '../utils/build-storage';
import { centerOffset, pageOverflow } from '../utils/page-layout';
import { exportCode, importCode, toolbarImport } from '../utils/share-code';
import {
  CLEAR_LABEL,
  CLOSE_LABEL,
  IN_BUILD_LABEL,
  LOCK_LABEL,
  LONE_WOLF,
  LONE_WOLF_LABEL,
  LONG_NAME,
  OTHER_BUILD_NAME,
  OUTDATED_BUILD,
  PAGE_PATH,
  PANEL_NAME,
  RENAME_LABEL,
  ROW_TOLERANCE,
  SELECT_LABEL,
  SQUADSIGHT,
  STORAGE_PREFIX,
} from './signature-skill.mock';

/**
 * Opens the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Opens the tested build and sets Lone Wolf as its Signature skill.
 *
 * @param page browser page.
 */
const openPanelWithSignatureSkill = async (page: Page) => {
  const panel = await openPanel(page);
  await selectSignatureSkill(page, panel, LONE_WOLF);

  return panel;
};

/**
 * How far the name of the first build with the name starts from the start of its item in the build navigation, in
 * pixels; it does not depend on the column of the item.
 *
 * @param page browser page.
 * @param buildName build name.
 */
const navNameOffset = async (page: Page, buildName: string) => {
  const [item, name] = await Promise.all([buildNavItem(page, buildName).boundingBox(), navBuildName(page, buildName).boundingBox()]);

  if (!item || !name) return Number.POSITIVE_INFINITY;

  return name.x - item.x;
};

/**
 * Name field in the header of the panel.
 *
 * @param panel build panel.
 */
const title = (panel: Locator) => panel.getByRole('textbox', { name: RENAME_LABEL });

test.describe('Signature skill button', () => {
  test('offers a Signature skill on a Default build', async ({ page }) => {
    const panel = await openPanel(page);

    await expect(panel.getByRole('button', { name: SELECT_LABEL, exact: true })).toBeVisible();
  });

  test('shows the perk saved in the dialog', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);

    await expect(panel.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeVisible();
  });

  test('keeps the Signature skill after a reload', async ({ page }) => {
    await openPanelWithSignatureSkill(page);

    const panel = await openPanel(page);

    await expect(panel.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeVisible();
  });

  test('clears the Signature skill on a reset', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);

    await resetBuild(panel);

    await expect(panel.getByRole('button', { name: SELECT_LABEL, exact: true })).toBeVisible();
  });

  test('is disabled on a Read-only build with a Signature skill', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);

    await panel.getByRole('button', { name: LOCK_LABEL }).click();

    await expect(panel.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeDisabled();
  });

  test('is hidden on a Read-only build without a Signature skill', async ({ page }) => {
    const panel = await openPanel(page);

    await panel.getByRole('button', { name: LOCK_LABEL }).click();

    await expect(signatureSkillButton(panel)).toHaveCount(0);
  });

  test('shows the Signature skill of an Outdated build disabled', async ({ page }) => {
    await seedBuilds(page, STORAGE_PREFIX, [OUTDATED_BUILD]);

    const panel = await openPanel(page);

    await expect(panel.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeDisabled();
  });
});

test.describe('Signature skill dialog', () => {
  test('marks a perk selected in the build as in the Build', async ({ page }) => {
    const panel = await openPanel(page);

    await signatureSkillButton(panel).click();

    await expect(signatureSkillTile(page, SQUADSIGHT).getByRole('img', { name: IN_BUILD_LABEL })).toBeVisible();
  });

  test('leaves a perk not selected in the build unmarked', async ({ page }) => {
    const panel = await openPanel(page);

    await signatureSkillButton(panel).click();

    await expect(signatureSkillTile(page, LONE_WOLF).getByRole('img', { name: IN_BUILD_LABEL })).toHaveCount(0);
  });

  test('opens with the current Signature skill pressed', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);

    await signatureSkillButton(panel).click();

    await expect(signatureSkillTile(page, LONE_WOLF)).toHaveAttribute('aria-pressed', 'true');
  });

  test('changes nothing on a click closed without Save', async ({ page }) => {
    const panel = await openPanel(page);
    await signatureSkillButton(panel).click();
    await signatureSkillTile(page, LONE_WOLF).click();

    await signatureSkillDialog(page).getByRole('button', { name: CLOSE_LABEL }).click();

    await expect(panel.getByRole('button', { name: SELECT_LABEL, exact: true })).toBeVisible();
  });

  test('clears the Signature skill with Clear and Save', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);
    await signatureSkillButton(panel).click();
    await signatureSkillDialog(page).getByRole('button', { name: CLEAR_LABEL, exact: true }).click();

    await signatureSkillDialog(page).getByRole('button', { name: 'Save', exact: true }).click();

    await expect(panel.getByRole('button', { name: SELECT_LABEL, exact: true })).toBeVisible();
  });

  test('offers no Clear without a marked perk', async ({ page }) => {
    const panel = await openPanel(page);

    await signatureSkillButton(panel).click();

    await expect(signatureSkillDialog(page).getByRole('button', { name: CLEAR_LABEL, exact: true })).toBeDisabled();
  });
});

test.describe('Signature skill in a Share code', () => {
  test('comes with the imported build', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);
    const code = await exportCode(page, panel);

    await importCode(page, toolbarImport(page), code);

    await expect(page.getByRole('region', { name: PANEL_NAME }).last().getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeVisible();
  });
});

test.describe('Signature skill button layout', () => {
  test('stands on the row of the name', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);

    const offset = await centerOffset(signatureSkillButton(panel), title(panel));

    expect(offset).toBeLessThanOrEqual(ROW_TOLERANCE);
  });

  test('stands before the name', async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);

    const [button, name] = await Promise.all([signatureSkillButton(panel).boundingBox(), title(panel).boundingBox()]);

    expect((button?.x ?? 0) + (button?.width ?? 0)).toBeLessThanOrEqual(name?.x ?? 0);
  });

  test('keeps a long name clear of the button on a phone', { tag: '@phone' }, async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);
    await title(panel).fill(LONG_NAME);

    const [button, name] = await Promise.all([signatureSkillButton(panel).boundingBox(), title(panel).boundingBox()]);

    expect((button?.x ?? 0) + (button?.width ?? 0)).toBeLessThanOrEqual(name?.x ?? 0);
  });

  test('has no horizontal scroll with a long name on a phone', { tag: '@phone' }, async ({ page }) => {
    const panel = await openPanelWithSignatureSkill(page);
    await title(panel).fill(LONG_NAME);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('Signature skill in the build navigation', () => {
  test('shows the perk name as the tooltip of the icon', async ({ page }) => {
    await openPanelWithSignatureSkill(page);

    await expect(navSignatureSkillIcon(page, PANEL_NAME, LONE_WOLF)).toHaveAttribute('title', LONE_WOLF);
  });

  test('lines up the name of a build without a Signature skill', async ({ page }) => {
    await openPanelWithSignatureSkill(page);

    const [offset, otherOffset] = await Promise.all([navNameOffset(page, PANEL_NAME), navNameOffset(page, OTHER_BUILD_NAME)]);

    expect(otherOffset).toBeCloseTo(offset, 0);
  });

  test('keeps the width of the name on a phone', { tag: '@phone' }, async ({ page }) => {
    await openPanelWithSignatureSkill(page);

    const [name, otherName] = await Promise.all([navBuildName(page, PANEL_NAME).boundingBox(), navBuildName(page, OTHER_BUILD_NAME).boundingBox()]);

    expect(name?.width).toBeCloseTo(otherName?.width ?? 0, 0);
  });

  test('has no horizontal scroll on a phone', { tag: '@phone' }, async ({ page }) => {
    await openPanelWithSignatureSkill(page);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });
});
