import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openBuildPanel } from '../utils/build-panel';
import { seedBuilds } from '../utils/build-storage';
import { centerOffset, overhang, pageOverflow, textOverflow } from '../utils/page-layout';
import {
  ACTIONS,
  LOCK_LABEL,
  OUTDATED_BUILD,
  OUTDATED_COUNT,
  OUTDATED_UPDATE_LABEL,
  PAGE_PATH,
  PANEL_NAME,
  REMOVE_LABEL,
  STORAGE_PREFIX,
  TOUCH_SIZE,
} from './panel-layout.mock';

/**
 * Opens the Biosoldier Build calculator and returns the panel of the tested build.
 *
 * @param page browser page.
 */
const openPanel = (page: Page) => openBuildPanel(page, PAGE_PATH, PANEL_NAME);

/**
 * Seeds the Outdated build and opens the Biosoldier Build calculator with it.
 *
 * @param page browser page.
 */
const openOutdatedPanel = async (page: Page) => {
  await seedBuilds(page, STORAGE_PREFIX, [OUTDATED_BUILD]);

  return openPanel(page);
};

/**
 * Name field in the header of the panel; it has no accessible name while it takes no new name, as on an Outdated build.
 *
 * @param panel build panel.
 */
const title = (panel: Locator) => panel.getByRole('textbox');

/**
 * Update button that stands in place of the lock on an Outdated build.
 *
 * @param panel build panel.
 */
const updateButton = (panel: Locator) => panel.getByRole('button', { name: OUTDATED_UPDATE_LABEL, exact: true });

/**
 * Visible label of a toolbar action.
 *
 * @param panel build panel.
 * @param action accessible name and visible label of the action.
 * @param action.name accessible name of the action.
 * @param action.label visible label of the action.
 */
const actionLabel = (panel: Locator, action: { name: string, label: string }) => panel.getByRole('button', { name: action.name, exact: true }).getByText(action.label, { exact: true });

test.describe('Build panel layout of an Outdated build', () => {
  test('shows the update button on the row of the name', async ({ page }) => {
    const panel = await openOutdatedPanel(page);

    const offset = await centerOffset(updateButton(panel), title(panel));

    expect(offset).toBeLessThanOrEqual(TOUCH_SIZE / 2);
  });

  test('keeps the update button clear of the name', async ({ page }) => {
    const panel = await openOutdatedPanel(page);

    const [button, name] = await Promise.all([updateButton(panel).boundingBox(), title(panel).boundingBox()]);

    expect(button?.x).toBeGreaterThanOrEqual((name?.x ?? 0) + (name?.width ?? 0));
  });

  test('keeps the update button inside the panel', async ({ page }) => {
    const panel = await openOutdatedPanel(page);

    const outside = await overhang(updateButton(panel), panel);

    expect(outside).toBeLessThanOrEqual(0);
  });

  test('keeps the count inside the update button', async ({ page }) => {
    const panel = await openOutdatedPanel(page);
    const button = updateButton(panel);

    const outside = await overhang(button.getByText(OUTDATED_COUNT, { exact: true }), button);

    expect(outside).toBeLessThanOrEqual(0);
  });

  test('has an update button big enough for a finger', async ({ page }) => {
    const panel = await openOutdatedPanel(page);

    const box = await updateButton(panel).boundingBox();

    expect(Math.min(box?.width ?? 0, box?.height ?? 0)).toBeGreaterThanOrEqual(TOUCH_SIZE);
  });

  test('shows the remove button below the tabs', async ({ page }) => {
    const panel = await openOutdatedPanel(page);

    const [remove, tabs] = await Promise.all([
      panel.getByRole('button', { name: REMOVE_LABEL, exact: true }).boundingBox(),
      panel.getByRole('tabpanel').boundingBox(),
    ]);

    expect(remove?.y).toBeGreaterThanOrEqual((tabs?.y ?? 0) + (tabs?.height ?? 0));
  });

  test('has no horizontal scroll on a phone', { tag: '@phone' }, async ({ page }) => {
    await openOutdatedPanel(page);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('Build panel layout of an editable build', () => {
  test('shows the lock on the row of the name', async ({ page }) => {
    const panel = await openPanel(page);

    const offset = await centerOffset(panel.getByRole('button', { name: LOCK_LABEL }), title(panel));

    expect(offset).toBeLessThanOrEqual(TOUCH_SIZE / 2);
  });

  test('shows the toolbar labels uncut', async ({ page }) => {
    const panel = await openPanel(page);
    const labels = ACTIONS.reduce((locator, action) => locator.or(actionLabel(panel, action)), actionLabel(panel, ACTIONS[0]));

    const overflow = await textOverflow(labels);

    expect(overflow).toBeLessThanOrEqual(0);
  });

  for (const action of ACTIONS) {
    test(`keeps the ${action.label} label inside the panel`, async ({ page }) => {
      const panel = await openPanel(page);

      const outside = await overhang(actionLabel(panel, action), panel);

      expect(outside).toBeLessThanOrEqual(0);
    });
  }
});
