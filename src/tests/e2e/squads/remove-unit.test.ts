import { expect, test } from '@playwright/test';

import { openBuildPanel } from '../utils/build-panel';
import { addNewBuildUnit, notifications, openSquads, removeUnit, unitCards } from '../utils/squads';
import { BIOSOLDIER_PATH, REMOVED_TOAST, SNIPER } from './remove-unit.mock';

test.describe('Unit removal', () => {
  test('removes the card once the trash button is held', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'Biosoldier', SNIPER);

    await removeUnit(unitCards(page, SNIPER), SNIPER);

    await expect(unitCards(page, SNIPER)).toHaveCount(0);
  });

  test('keeps the card clicked without holding', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'Biosoldier', SNIPER);

    await unitCards(page, SNIPER).getByRole('button', { name: `Remove ${SNIPER}`, exact: true }).click();

    await expect(unitCards(page, SNIPER)).toHaveCount(1);
  });

  test('tells that the build stays', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'Biosoldier', SNIPER);

    await removeUnit(unitCards(page, SNIPER), SNIPER);

    await expect(notifications(page).getByText(REMOVED_TOAST)).toBeVisible();
  });

  test('keeps the build in its Build calculator', async ({ page }) => {
    await openSquads(page);
    await addNewBuildUnit(page, 'Biosoldier', SNIPER);
    await removeUnit(unitCards(page, SNIPER), SNIPER);

    await openBuildPanel(page, BIOSOLDIER_PATH, SNIPER);

    await expect(page.getByRole('region', { name: SNIPER })).toHaveCount(2);
  });
});
