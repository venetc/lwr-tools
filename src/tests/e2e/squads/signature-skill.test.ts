import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openBuildPanel, selectSignatureSkill } from '../utils/build-panel';
import { overhang, pageOverflow } from '../utils/page-layout';
import {
  addSavedUnit,
  enterUnitCode,
  importSquadCode,
  importUnitCode,
  openAddUnit,
  openBuildDialog,
  openSquads,
  savedBuildRow,
  signatureSkillIcon,
  unitCards,
} from '../utils/squads';
import {
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  IN_THE_ZONE,
  LONE_WOLF,
  LONE_WOLF_LABEL,
  LONE_WOLF_QUERY,
  SERAPH_SNIPER,
  SERAPH_UNIT_CODE,
  SNIPER,
  SNIPER_BUILD_CODE,
  SQUAD_CODE,
  SQUAD_SIGNATURE_SKILLS,
} from './signature-skill.mock';

/**
 * Sets Lone Wolf as the Signature skill of the saved Sniper build in its Build calculator, then opens the Squad planner
 * and its Add Unit dialog.
 *
 * @param page browser page.
 */
const openAddUnitWithSignatureSkill = async (page: Page) => {
  const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
  await selectSignatureSkill(page, panel, LONE_WOLF);
  await openSquads(page);

  return openAddUnit(page);
};

test.describe('Signature skill in the Build dialog', () => {
  test('is set in the dialog', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);

    await selectSignatureSkill(page, dialog, LONE_WOLF);

    await expect(dialog.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeVisible();
  });

  test('is kept in the Build calculator', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await selectSignatureSkill(page, dialog, LONE_WOLF);

    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);

    await expect(panel.getByRole('button', { name: LONE_WOLF_LABEL, exact: true })).toBeVisible();
  });

  test('changes the icon on the Unit card', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
    await selectSignatureSkill(page, dialog, LONE_WOLF);
    await page.keyboard.press('Escape');

    await expect(signatureSkillIcon(unitCards(page, SNIPER), LONE_WOLF)).toHaveAttribute('title', LONE_WOLF);
  });
});

test.describe('Signature skill on a Unit card', () => {
  test('shows the perk name as the tooltip of the icon', async ({ page }) => {
    await openSquads(page);

    await importUnitCode(page, SERAPH_UNIT_CODE);

    await expect(signatureSkillIcon(unitCards(page, SERAPH_SNIPER), IN_THE_ZONE)).toHaveAttribute('title', IN_THE_ZONE);
  });

  for (const { buildName, perkName } of SQUAD_SIGNATURE_SKILLS) {
    test(`comes with the Unit ${buildName} of a Squad code`, async ({ page }) => {
      await openSquads(page);

      await importSquadCode(page, SQUAD_CODE);

      await expect(signatureSkillIcon(unitCards(page, buildName), perkName)).toBeVisible();
    });
  }

  test('has no horizontal scroll on a phone', { tag: '@phone' }, async ({ page }) => {
    await openSquads(page);
    await importUnitCode(page, SERAPH_UNIT_CODE);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('Signature skill in Add Unit', () => {
  test('shows the icon in the row of a saved build', async ({ page }) => {
    const dialog = await openAddUnitWithSignatureSkill(page);

    await expect(signatureSkillIcon(savedBuildRow(dialog, BIOSOLDIER_BUILDS, SNIPER), LONE_WOLF)).toHaveAttribute('title', LONE_WOLF);
  });

  test('names the Signature skill after the build in the row', async ({ page }) => {
    const dialog = await openAddUnitWithSignatureSkill(page);

    await expect(savedBuildRow(dialog, BIOSOLDIER_BUILDS, SNIPER)).toHaveAccessibleName(new RegExp(`${LONE_WOLF_LABEL}$`));
  });

  test('finds a build by its Signature skill', async ({ page }) => {
    const dialog = await openAddUnitWithSignatureSkill(page);

    await dialog.getByRole('textbox', { name: 'Search builds' }).fill(LONE_WOLF_QUERY);

    await expect(dialog.getByRole('listitem')).toHaveText([new RegExp(SNIPER)]);
  });

  test('previews the Signature skill of a Share code', async ({ page }) => {
    await openSquads(page);

    const dialog = await enterUnitCode(page, SNIPER_BUILD_CODE);

    await expect(signatureSkillIcon(dialog.getByRole('status', { name: 'Preview' }), IN_THE_ZONE)).toBeVisible();
  });

  test('keeps the row of a saved build inside the dialog on a phone', { tag: '@phone' }, async ({ page }) => {
    const dialog = await openAddUnitWithSignatureSkill(page);

    const sticking = await overhang(savedBuildRow(dialog, BIOSOLDIER_BUILDS, SNIPER), dialog);

    expect(sticking).toBeLessThanOrEqual(0);
  });
});
