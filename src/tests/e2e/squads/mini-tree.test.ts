import { expect, test } from '@playwright/test';

import { abilityCell, openBuildPanel, selectAbility } from '../utils/build-panel';
import { addSavedUnit, miniTreeStep, openBuildDialog, openSquads, unitCards } from '../utils/squads';
import {
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  JAEGER,
  LOCK_LABEL,
  LOCKED_RANK_STEP,
  MAGNUM,
  MAGNUM_STEP,
  MEC_BUILDS,
  MEC_PATH,
  MEC_ROW,
  MINI_TREE_ROWS,
  OFFICER_CAPTIONS,
  OFFICER_ROW,
  OFFICER_TAB,
  OPEN_LIEUTENANT_STEP,
  OPEN_RANK_STEP,
  SHIV,
  SHIV_BUILDS,
  SHIV_ROW,
  SNIPER,
  SNIPER_ROWS,
  SQUADSIGHT_STEP,
  STRENGTH_IN_NUMBERS,
  STRENGTH_IN_NUMBERS_STEP,
} from './mini-tree.mock';

test.describe('Mini-tree of a Unit card', () => {
  test('shows the four branches of a biosoldier even when empty', async ({ page }) => {
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
    const panel = await openBuildPanel(page, MEC_PATH, JAEGER);
    await panel.getByRole('button', { name: LOCK_LABEL }).click();
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    const [openColor, lockedColor] = await Promise.all([
      miniTreeStep(unitCards(page, SNIPER), OPEN_RANK_STEP),
      miniTreeStep(unitCards(page, JAEGER), LOCKED_RANK_STEP),
    ].map(step => step.locator('span').first().evaluate(element => getComputedStyle(element).borderTopColor)));

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

  test('captions the officer steps with the officer rank abbreviations', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER).getByRole('list', { name: OFFICER_ROW, exact: true }).getByRole('listitem')).toHaveText(OFFICER_CAPTIONS);
  });

  test('opens Lieutenant with only the base perk in the Class tree', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(miniTreeStep(unitCards(page, SNIPER), OPEN_LIEUTENANT_STEP)).toBeVisible();
  });

  test('shows the selected officer perk of an officer rank', async ({ page }) => {
    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
    await selectAbility(panel, OFFICER_TAB, STRENGTH_IN_NUMBERS);
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(miniTreeStep(unitCards(page, SNIPER), STRENGTH_IN_NUMBERS_STEP)).toBeVisible();
  });

  test('opens the Build dialog', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openBuildDialog(page, unitCards(page, SNIPER), SNIPER);

    await expect(dialog).toBeVisible();
  });
});
