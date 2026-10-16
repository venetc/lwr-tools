import type { Locator, Page } from '@playwright/test';

/**
 * Share code of the build from its export form; the form is closed afterwards.
 *
 * @param page browser page.
 * @param panel build panel.
 */
export const exportCode = async (page: Page, panel: Locator) => {
  await panel.getByRole('button', { name: 'Export build' }).click();

  const code = await page.getByRole('dialog').getByRole('textbox', { name: 'Code' }).inputValue();

  await page.keyboard.press('Escape');

  return code;
};

/**
 * Opens the import form with the trigger, enters the code and submits it.
 *
 * @param page browser page.
 * @param trigger button that opens the import form: `Import` in the toolbar or `Import build` in a panel.
 * @param code Share code.
 */
export const importCode = async (page: Page, trigger: Locator, code: string) => {
  await trigger.click();

  const dialog = page.getByRole('dialog');

  await dialog.getByRole('textbox', { name: 'Code' }).fill(code);
  await dialog.getByRole('button', { name: 'Import', exact: true }).click();
};

/**
 * `Import` button of the toolbar, which adds an imported build.
 *
 * @param page browser page.
 */
export const toolbarImport = (page: Page) => page.getByRole('main').getByRole('button', { name: 'Import', exact: true });
