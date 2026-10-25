import { expect, test } from '@playwright/test';

import { abilityCell } from '../utils/build-panel';
import { channelDistance, holdImages, imageCorner, placeholderBackdrop } from '../utils/image-loading';
import { COLOR_TOLERANCE, HOLO_ROUNDS, PAGE_PATH, PANEL_NAME } from './icon-placeholder.mock';

test.describe('SHIV perk icon placeholder', () => {
  test('has the background of the icon of a perk open for selection', async ({ page }) => {
    const release = await holdImages(page);
    await page.goto(PAGE_PATH);
    const panel = page.getByRole('region', { name: PANEL_NAME }).first();
    const icon = abilityCell(panel, HOLO_ROUNDS).getByRole('img', { name: HOLO_ROUNDS });
    const backdrop = await placeholderBackdrop(icon);

    await release();

    expect(channelDistance(backdrop, await imageCorner(icon))).toBeLessThanOrEqual(COLOR_TOLERANCE);
  });
});
