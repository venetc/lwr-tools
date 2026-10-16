import type { Locator, Page } from '@playwright/test';

import { waitForImages } from './page-load';

/**
 * Opens a Build calculator and returns the first build panel with the name once the icons of the page have loaded.
 * Opening it again reloads the page, so it also checks what a build keeps after a reload.
 *
 * @description The panels mount after the `load` event, so the panel is awaited before the icons.
 *
 * @param page browser page.
 * @param path path of the calculator.
 * @param panelName accessible name of the panel: the Class name, or `SHIV`.
 */
export const openBuildPanel = async (page: Page, path: string, panelName: string) => {
  await page.goto(path);

  const panel = page.getByRole('region', { name: panelName }).first();

  await panel.waitFor();
  await waitForImages(page);

  return panel;
};

/**
 * Cell of an ability, a Perk, a Gene mod or a Psionic ability, on the visible tab of the panel.
 *
 * @param panel build panel.
 * @param abilityName ability name.
 */
export const abilityCell = (panel: Locator, abilityName: string) => panel.getByRole('button', { name: abilityName, exact: true });

/**
 * Switches the panel to the tab and selects the ability on it.
 *
 * @param panel build panel.
 * @param tabName accessible name of the tab.
 * @param abilityName ability name.
 */
export const selectAbility = async (panel: Locator, tabName: RegExp, abilityName: string) => {
  await panel.getByRole('tab', { name: tabName }).click();
  await abilityCell(panel, abilityName).click();
};

/**
 * Description of the inspected ability below the rows.
 *
 * @param panel build panel.
 */
export const description = (panel: Locator) => panel.locator('[aria-live="polite"]');
