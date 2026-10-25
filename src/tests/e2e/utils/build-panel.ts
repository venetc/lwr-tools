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
 * Adds a build of the Class with the `Add` menu of the toolbar.
 *
 * @param page browser page.
 * @param className name of the Class in the menu.
 */
export const addBuild = async (page: Page, className: string) => {
  await page.getByRole('main').getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('menuitem', { name: className, exact: true }).click();
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
 * Switches the panel to the tab and selects the abilities on it in order, such as one Perk per rank of the Class tree.
 *
 * @param panel build panel.
 * @param tabName accessible name of the tab.
 * @param abilityNames ability names in selection order.
 */
export const selectAbilities = async (panel: Locator, tabName: RegExp, abilityNames: string[]) => {
  for (const abilityName of abilityNames) await selectAbility(panel, tabName, abilityName);
};

/**
 * Description of the inspected ability below the rows.
 *
 * @param panel build panel.
 */
export const description = (panel: Locator) => panel.locator('[aria-live="polite"]');

/**
 * Removes the build of the panel by holding its trash button.
 *
 * @param panel build panel.
 */
export const removeBuild = (panel: Locator) => panel.getByRole('button', { name: 'Remove build', exact: true }).click({ delay: 700 });

/**
 * Resets the build of the panel by holding its reset button.
 *
 * @param panel build panel.
 */
export const resetBuild = (panel: Locator) => panel.getByRole('button', { name: 'Reset build', exact: true }).click({ delay: 700 });

/**
 * Dialog that asks whether to delete a build standing in Squads.
 *
 * @param page browser page.
 * @param buildName build name.
 */
export const buildRemovalDialog = (page: Page, buildName: string) => page.getByRole('dialog', { name: `Delete «${buildName}»?` });

/**
 * Signature skill button in the header of the panel, with or without a Signature skill.
 *
 * @param panel build panel.
 */
export const signatureSkillButton = (panel: Locator) => panel.getByRole('button', { name: /^(Select signature skill|Signature skill: )/ });

/**
 * «Select signature skill:» dialog of a build panel.
 *
 * @param page browser page.
 */
export const signatureSkillDialog = (page: Page) => page.getByRole('dialog', { name: 'Select signature skill:' });

/**
 * Tile of a perk in the Signature skill dialog; its name also holds «In the Build» for a perk selected in the build.
 *
 * @param page browser page.
 * @param perkName perk name.
 */
export const signatureSkillTile = (page: Page, perkName: string) => signatureSkillDialog(page).getByRole('button', { name: perkName });

/**
 * Sets the Signature skill of the build of the panel: opens the dialog, marks the perk and saves.
 *
 * @param page browser page.
 * @param panel build panel.
 * @param perkName perk name.
 */
export const selectSignatureSkill = async (page: Page, panel: Locator, perkName: string) => {
  await signatureSkillButton(panel).click();
  await signatureSkillTile(page, perkName).click();
  await signatureSkillDialog(page).getByRole('button', { name: 'Save', exact: true }).click();
};
