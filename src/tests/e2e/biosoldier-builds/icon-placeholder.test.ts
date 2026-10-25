import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { abilityCell } from '../utils/build-panel';
import { backgroundImage, channelDistance, holdImages, imageCorner, placeholderBackdrop } from '../utils/image-loading';
import { waitForImages } from '../utils/page-load';
import { COLOR_TOLERANCE, COUNTERCHARGE, LOCK_LABEL, MAGNUM, PAGE_PATH, PANEL_NAME, PSIONIC_TAB, SHARPSHOOTER } from './icon-placeholder.mock';

/**
 * Opens the calculator with its images held loading and returns the build panel with the release of the images.
 *
 * @param page browser page.
 */
const openWithHeldImages = async (page: Page) => {
  const release = await holdImages(page);

  await page.goto(PAGE_PATH);

  const panel = page.getByRole('region', { name: PANEL_NAME }).first();

  await panel.waitFor();

  return { panel, release };
};

/**
 * Visible icon of the ability cell: the variant of the cell look, named after the ability.
 *
 * @param panel build panel.
 * @param abilityName ability name.
 */
const cellIcon = (panel: Locator, abilityName: string) => abilityCell(panel, abilityName).getByRole('img', { name: abilityName });

test.describe('Perk icon placeholder', () => {
  test('is shown while the icon loads', async ({ page }) => {
    const { panel } = await openWithHeldImages(page);

    await expect.poll(() => backgroundImage(cellIcon(panel, SHARPSHOOTER))).toContain('gradient');
  });

  test('is removed once the icon loads', async ({ page }) => {
    const { panel, release } = await openWithHeldImages(page);

    await release();
    await waitForImages(page);

    await expect.poll(() => backgroundImage(cellIcon(panel, MAGNUM))).toBe('none');
  });

  test('has the background of the icon of a perk disabled in a locked build', async ({ page }) => {
    const { panel, release } = await openWithHeldImages(page);
    await panel.getByRole('button', { name: LOCK_LABEL }).click();
    const icon = cellIcon(panel, SHARPSHOOTER);
    const backdrop = await placeholderBackdrop(icon);

    await release();

    expect(channelDistance(backdrop, await imageCorner(icon))).toBeLessThanOrEqual(COLOR_TOLERANCE);
  });

  test('has the background of the icon of a psionic ability', async ({ page }) => {
    const { panel, release } = await openWithHeldImages(page);
    await panel.getByRole('tab', { name: PSIONIC_TAB }).click();
    const icon = cellIcon(panel, COUNTERCHARGE);
    const backdrop = await placeholderBackdrop(icon);

    await release();

    expect(channelDistance(backdrop, await imageCorner(icon))).toBeLessThanOrEqual(COLOR_TOLERANCE);
  });
});
