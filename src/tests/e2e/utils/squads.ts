import type { Locator, Page } from '@playwright/test';

/**
 * Name field of the open Squad.
 *
 * @param page browser page.
 */
export const squadTitle = (page: Page) => page.getByRole('textbox', { name: 'Rename Squad' });

/**
 * Opens the Squad planner and returns the name field of the open Squad once it is shown. Opening it again reloads
 * the page, so it also checks what Squads keep after a reload.
 *
 * @param page browser page.
 */
export const openSquads = async (page: Page) => {
  await page.goto('/squads');

  const title = squadTitle(page);

  await title.waitFor();

  return title;
};

/**
 * Squad list of the toolbar.
 *
 * @param page browser page.
 */
export const squadList = (page: Page) => page.getByRole('navigation', { name: 'Squads' });

/**
 * Item of the Squad list that opens the Squad.
 *
 * @param page browser page.
 * @param name Squad name.
 * @param unitCount number of Units the item shows.
 */
export const squadItem = (page: Page, name: string, unitCount: number) => squadList(page).getByRole('button', { name: `${name}, ${unitCount}`, exact: true });

/**
 * Renames the open Squad and finishes editing.
 *
 * @param title name field of the open Squad.
 * @param name new Squad name.
 */
export const renameSquad = async (title: Locator, name: string) => {
  await title.fill(name);
  await title.press('Enter');
};

/**
 * Adds a new Squad with the `New Squad` button of the toolbar.
 *
 * @param page browser page.
 */
export const addSquad = (page: Page) => page.getByRole('main').getByRole('button', { name: 'New Squad', exact: true }).click();

/**
 * Removes the Squad by holding its trash button in the Squad list.
 *
 * @param page browser page.
 * @param name Squad name.
 */
export const removeSquad = (page: Page, name: string) => squadList(page).getByRole('button', { name: `Remove ${name}`, exact: true }).click({ delay: 700 });
