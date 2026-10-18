import { expect, test } from '@playwright/test';

import { openBuildPanel } from '../utils/build-panel';
import { addNewBuildUnit, addSavedUnit, addUnitCell, notifications, openAddUnit, openSquads, savedBuildRow, squadItem, unitCards } from '../utils/squads';
import {
  ALL_FILTER,
  BIOSOLDIER_BUILDS,
  BIOSOLDIER_PATH,
  GROUP_TITLES,
  IN_SQUAD_TWICE,
  JAEGER,
  MEC_BUILDS,
  MEC_FILTER,
  MEC_PATH,
  NEW_BUILD_TOAST,
  RENAMED_SNIPER,
  SAVED_BUILD_TOAST,
  SHIV,
  SHIV_PATH,
  SNIPER,
  SQUAD_NAME,
  TWO_UNITS_SUMMARY,
} from './add-unit.mock';

test.describe('Add Unit from saved builds', () => {
  test('opens from the add cell', async ({ page }) => {
    await openSquads(page);

    await addUnitCell(page).click();

    await expect(page.getByRole('dialog', { name: 'Add Unit' })).toBeVisible();
  });

  test('groups saved builds by Build calculator', async ({ page }) => {
    await openSquads(page);

    const dialog = await openAddUnit(page);

    await expect(dialog.getByRole('heading', { level: 3 })).toHaveText(GROUP_TITLES);
  });

  test('finds a build by its name', async ({ page }) => {
    await openSquads(page);
    const dialog = await openAddUnit(page);

    await dialog.getByRole('textbox', { name: 'Search builds' }).fill('jae');

    await expect(dialog.getByRole('listitem')).toHaveCount(1);
  });

  test('finds a build by its Class', async ({ page }) => {
    const panel = await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);
    await panel.getByRole('textbox', { name: 'Rename build' }).fill(RENAMED_SNIPER);
    await panel.getByRole('textbox', { name: 'Rename build' }).press('Enter');
    await openSquads(page);
    const dialog = await openAddUnit(page);

    await dialog.getByRole('textbox', { name: 'Search builds' }).fill(SNIPER);

    await expect(savedBuildRow(dialog, BIOSOLDIER_BUILDS, RENAMED_SNIPER)).toBeVisible();
  });

  test('counts the builds of each unit type', async ({ page }) => {
    await openSquads(page);

    const dialog = await openAddUnit(page);

    await expect(dialog.getByRole('button', { name: ALL_FILTER, exact: true })).toBeVisible();
  });

  test('keeps only the builds of the chosen unit type', async ({ page }) => {
    await openSquads(page);
    const dialog = await openAddUnit(page);

    await dialog.getByRole('button', { name: MEC_FILTER, exact: true }).click();

    await expect(dialog.getByRole('list', { name: BIOSOLDIER_BUILDS })).toHaveCount(0);
  });

  test('adds a card for the build', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER)).toHaveCount(1);
  });

  test('keeps the add cell last', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(page.getByRole('main').locator(':scope article + button')).toHaveAccessibleName('Add Unit');
  });

  test('tells where the Unit is added', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(notifications(page).getByText(SAVED_BUILD_TOAST)).toBeVisible();
  });

  test('closes after adding without opening another dialog', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('adds the same build again', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect(unitCards(page, SNIPER)).toHaveCount(2);
  });

  test('marks a build already in the Squad', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    const dialog = await openAddUnit(page);

    await expect(savedBuildRow(dialog, BIOSOLDIER_BUILDS, SNIPER)).toContainText(IN_SQUAD_TWICE);
  });

  test('counts the Units in the summary', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    await expect(page.getByRole('main').getByText(TWO_UNITS_SUMMARY, { exact: true })).toBeVisible();
  });

  test('counts the Units in the Squad list', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await addSavedUnit(page, MEC_BUILDS, JAEGER);

    await expect(squadItem(page, SQUAD_NAME, 2)).toBeVisible();
  });

  test('keeps the Units after a reload', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await openSquads(page);

    await expect(unitCards(page, SNIPER)).toHaveCount(1);
  });
});

test.describe('Add Unit from a new build', () => {
  test('adds a biosoldier build to its Build calculator', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'Biosoldier', SNIPER);

    await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);

    await expect(page.getByRole('region', { name: SNIPER })).toHaveCount(2);
  });

  test('adds a MEC build to its Build calculator', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'MEC', JAEGER);

    await openBuildPanel(page, MEC_PATH, JAEGER);

    await expect(page.getByRole('region', { name: JAEGER })).toHaveCount(2);
  });

  test('adds a SHIV build to its Build calculator', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, SHIV, SHIV);

    await openBuildPanel(page, SHIV_PATH, SHIV);

    await expect(page.getByRole('region', { name: SHIV })).toHaveCount(2);
  });

  test('adds a card for the new build', async ({ page }) => {
    await openSquads(page);

    await addNewBuildUnit(page, 'MEC', JAEGER);

    await expect(unitCards(page, JAEGER)).toHaveCount(1);
  });

  test('tells where the new build is added', async ({ page }) => {
    await openSquads(page);

    await addNewBuildUnit(page, 'Biosoldier', SNIPER);

    await expect(notifications(page).getByText(NEW_BUILD_TOAST)).toBeVisible();
  });
});
