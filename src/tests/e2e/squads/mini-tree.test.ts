import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel } from '../utils/build-panel';
import { addSavedUnit, miniTreeStep, openBuildDialog, openSquads, unitCards } from '../utils/squads';
import {
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  JAEGER,
  LOCKED_RANK_STEP,
  MAGNUM,
  MAGNUM_STEP,
  MEC_BUILDS,
  MEC_ROW,
  MINI_TREE_ROWS,
  OPEN_RANK_STEP,
  SHIV,
  SHIV_BUILDS,
  SHIV_ROW,
  SNIPER,
  SNIPER_ROWS,
  SQUADSIGHT_STEP,
} from './mini-tree.mock';

test.describe('Mini-tree of a Unit card', () => {
  test('shows the three branches of a biosoldier even when empty', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER)).toMatchAriaSnapshot(SNIPER_ROWS);
  });

  test('shows one row of a MEC', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    await expect(unitCards(page, JAEGER).getByRole('list', { name: MINI_TREE_ROWS })).toHaveAccessibleName(MEC_ROW);
  });

  test('shows one row of a SHIV', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, SHIV_BUILDS, SHIV);

    await expect(unitCards(page, SHIV).getByRole('list', { name: MINI_TREE_ROWS })).toHaveAccessibleName(SHIV_ROW);
  });

  test('shows the selected perk of a rank', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(miniTreeStep(unitCards(page, SNIPER), SQUADSIGHT_STEP)).toBeVisible();
  });

  test('draws an empty step dashed', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(miniTreeStep(unitCards(page, SNIPER), OPEN_RANK_STEP).locator('span').first()).toHaveCSS('border-top-style', 'dashed');
  });

  test('colours an open step apart from a locked one', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const card = unitCards(page, SNIPER);

    const [openColor, lockedColor] = await Promise.all([OPEN_RANK_STEP, LOCKED_RANK_STEP].map(label => (
      miniTreeStep(card, label).locator('span').first().evaluate(element => getComputedStyle(element).borderTopColor)
    )));

    expect(openColor).not.toBe(lockedColor);
  });

  test('follows a perk selected in the Build calculator', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
    await abilityCell(panel, MAGNUM).click();

    await openSquads(page);

    await expect(miniTreeStep(unitCards(page, SNIPER), MAGNUM_STEP)).toBeVisible();
  });

  test('opens the Build dialog', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);

    await expect(dialog).toBeVisible();
  });
});
