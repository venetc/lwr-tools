import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { backgroundImage, holdImages } from '../utils/image-loading';
import { waitForImages } from '../utils/page-load';
import { addSavedUnit, loadoutTile, openSquads, unitCards } from '../utils/squads';
import { ARMOR_TILE, BIOSOLDIER_BUILDS, SNIPER } from './image-placeholder.mock';

/**
 * Picture of the armor on the Loadout tile of a new Sniper Unit.
 *
 * @param page browser page.
 */
const armorPicture = (page: Page) => loadoutTile(unitCards(page, SNIPER).first(), ARMOR_TILE).locator('img');

test.describe('Loadout picture placeholder', () => {
  test('is shown while the picture loads', async ({ page }) => {
    await holdImages(page);
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

    await expect.poll(() => backgroundImage(armorPicture(page))).toContain('gradient');
  });

  test('is removed once the transparent picture loads', async ({ page }) => {
    await openSquads(page);

    await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);
    await waitForImages(page);

    await expect.poll(() => backgroundImage(armorPicture(page))).toBe('none');
  });
});
