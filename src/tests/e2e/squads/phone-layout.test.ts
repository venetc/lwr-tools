import { expect, test } from '@playwright/test';

import { pageOverflow } from '../utils/page-layout';
import { addSavedUnit, addSquad, openAddUnit, openBuildDialog, openLoadoutDialog, openSquads, unitCards } from '../utils/squads';
import { ARMOR_TILE, BIOSOLDIER_BUILDS, MEC_BUILDS, ROCKETEER, SHIV, SHIV_BUILDS, SHOGUN, SQUAD_COUNT } from './phone-layout.mock';

test.describe('Squad planner on a phone', () => {
  test.skip(({ isMobile }) => !isMobile, 'Phone layout only');

  test('has no horizontal scroll', async ({ page }) => {
    await openSquads(page);
    for (let index = 1; index < SQUAD_COUNT; index++) await addSquad(page);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('has no horizontal scroll with Unit cards', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);
    await addSavedUnit(page, MEC_BUILDS, SHOGUN);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('shows Unit cards in one column', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);

    const [card, cell] = await Promise.all([
      page.getByRole('main').getByRole('article').boundingBox(),
      page.getByRole('main').getByRole('button', { name: 'Add Unit', exact: true }).boundingBox(),
    ]);

    expect(cell?.y).toBeGreaterThan((card?.y ?? 0) + (card?.height ?? 0));
  });

  test('opens Add Unit full screen', async ({ page }) => {
    await openSquads(page);

    const box = await (await openAddUnit(page)).boundingBox();

    expect(box?.width).toBe(page.viewportSize()?.width);
  });

  test('opens the Build dialog full screen', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);

    const box = await (await openBuildDialog(page, unitCards(page, ROCKETEER), ROCKETEER)).boundingBox();

    expect(box?.width).toBe(page.viewportSize()?.width);
  });

  test('opens the Loadout dialog full screen', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);

    const box = await (await openLoadoutDialog(page, unitCards(page, ROCKETEER), ARMOR_TILE)).boundingBox();

    expect(box?.width).toBe(page.viewportSize()?.width);
  });
});
