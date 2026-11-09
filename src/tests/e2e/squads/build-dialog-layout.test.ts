import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { centerOffset } from '../utils/page-layout';
import { addSavedUnit, openBuildDialog, openSquads, unitCards } from '../utils/squads';
import {
  BIOSOLDIER_BUILDS,
  CLOSE_LABEL,
  HUG_MAX_EXTRA_WIDTH,
  LOCK_LABEL,
  LOW_PHONE_VIEWPORT,
  NAME_MAX_TOP,
  RENAME_LABEL,
  SHARE_LABEL,
  SNIPER,
  TOUCH_SIZE,
  WIDE_PHONE_VIEWPORT,
} from './build-dialog-layout.mock';

/**
 * Close button of the Build dialog.
 *
 * @param dialog Build dialog.
 */
const closeButton = (dialog: Locator) => dialog.getByRole('button', { name: CLOSE_LABEL, exact: true });

/**
 * Name field in the header of the Build panel.
 *
 * @param dialog Build dialog.
 */
const title = (dialog: Locator) => dialog.getByRole('textbox', { name: RENAME_LABEL });

/**
 * Opens the Squad planner with a Sniper Unit and its Build dialog.
 *
 * @param page browser page.
 */
const openSniperDialog = async (page: Page) => {
  await openSquads(page);
  await addSavedUnit(page, BIOSOLDIER_BUILDS, SNIPER);

  return openBuildDialog(page, unitCards(page, SNIPER), SNIPER);
};

test.describe('Build dialog layout', () => {
  test('shows the close button on the row of the build name', async ({ page }) => {
    const dialog = await openSniperDialog(page);

    const offset = await centerOffset(closeButton(dialog), title(dialog));

    expect(offset).toBeLessThanOrEqual(TOUCH_SIZE / 2);
  });

  test('shows the close button after the lock', async ({ page }) => {
    const dialog = await openSniperDialog(page);

    const [close, lock] = await Promise.all([closeButton(dialog).boundingBox(), dialog.getByRole('button', { name: LOCK_LABEL }).boundingBox()]);

    expect(close?.x).toBeGreaterThanOrEqual((lock?.x ?? 0) + (lock?.width ?? 0));
  });

  test('focuses the dialog itself on open, not a control of the Build panel', async ({ page }) => {
    const dialog = await openSniperDialog(page);

    await expect(dialog).toBeFocused();
  });

  test('starts with the build name, without a header of its own', async ({ page }) => {
    const dialog = await openSniperDialog(page);

    const [name, box] = await Promise.all([title(dialog).boundingBox(), dialog.boundingBox()]);

    expect((name?.y ?? 0) - (box?.y ?? 0)).toBeLessThanOrEqual(NAME_MAX_TOP);
  });

  test('hugs the Build panel', { tag: '@desktop' }, async ({ page }) => {
    const dialog = await openSniperDialog(page);

    const [panel, box] = await Promise.all([dialog.getByRole('region', { name: SNIPER }).boundingBox(), dialog.boundingBox()]);

    expect((box?.width ?? 0) - (panel?.width ?? 0)).toBeLessThanOrEqual(HUG_MAX_EXTRA_WIDTH);
  });

  test('centers the Build panel on a wide phone', { tag: '@phone' }, async ({ page }) => {
    await page.setViewportSize(WIDE_PHONE_VIEWPORT);
    const dialog = await openSniperDialog(page);

    const [panel, box] = await Promise.all([dialog.getByRole('region', { name: SNIPER }).boundingBox(), dialog.boundingBox()]);
    const left = (panel?.x ?? 0) - (box?.x ?? 0);
    const right = (box?.x ?? 0) + (box?.width ?? 0) - (panel?.x ?? 0) - (panel?.width ?? 0);

    expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
  });

  test('keeps the close button on screen once the dialog is scrolled down', { tag: '@phone' }, async ({ page }) => {
    await page.setViewportSize(LOW_PHONE_VIEWPORT);
    const dialog = await openSniperDialog(page);

    await dialog.getByRole('button', { name: SHARE_LABEL, exact: true }).scrollIntoViewIfNeeded();

    await expect(closeButton(dialog)).toBeInViewport({ ratio: 1 });
  });
});
