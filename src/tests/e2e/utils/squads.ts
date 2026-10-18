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

/**
 * Cell of the Squad grid that opens the Add Unit dialog.
 *
 * @param page browser page.
 */
export const addUnitCell = (page: Page) => page.getByRole('main').getByRole('button', { name: 'Add Unit', exact: true });

/**
 * Opens the Add Unit dialog from the add cell and returns it.
 *
 * @param page browser page.
 */
export const openAddUnit = async (page: Page) => {
  await addUnitCell(page).click();

  const dialog = page.getByRole('dialog', { name: 'Add Unit' });

  await dialog.waitFor();

  return dialog;
};

/**
 * Row of a saved build in the Add Unit dialog.
 *
 * @param dialog Add Unit dialog.
 * @param buildList name of the Build calculator group: `Biosoldier builds`.
 * @param buildName build name.
 */
export const savedBuildRow = (dialog: Locator, buildList: string, buildName: string) => (
  dialog.getByRole('list', { name: buildList }).getByRole('button', { name: new RegExp(`^${buildName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} `) })
);

/**
 * Adds a Unit of a saved build through the Add Unit dialog.
 *
 * @param page browser page.
 * @param buildList name of the Build calculator group: `Biosoldier builds`.
 * @param buildName build name.
 */
export const addSavedUnit = async (page: Page, buildList: string, buildName: string) => {
  const dialog = await openAddUnit(page);

  await savedBuildRow(dialog, buildList, buildName).click();
};

/**
 * Adds a Unit of a new Default build through the New build tab of the Add Unit dialog.
 *
 * @param page browser page.
 * @param unitType unit type group: `Biosoldier`, `MEC` or `SHIV`.
 * @param optionName Class name, or `SHIV`.
 */
export const addNewBuildUnit = async (page: Page, unitType: string, optionName: string) => {
  const dialog = await openAddUnit(page);

  await dialog.getByRole('tab', { name: 'New build' }).click();
  await dialog.getByRole('list', { name: unitType, exact: true }).getByRole('button', { name: optionName, exact: true }).click();
};

/**
 * Cards of the Units with the build name.
 *
 * @param page browser page.
 * @param buildName build name.
 */
export const unitCards = (page: Page, buildName: string) => page.getByRole('main').getByRole('article', { name: buildName, exact: true });

/**
 * Removes the Unit of the card by holding its trash button.
 *
 * @param card Unit card.
 * @param buildName build name of the Unit.
 */
export const removeUnit = (card: Locator, buildName: string) => card.getByRole('button', { name: `Remove ${buildName}`, exact: true }).click({ delay: 700 });

/**
 * Stored Unit for seeding a Squad: items as catalog codes.
 */
export interface SeededUnit {
  /** Unit id. */
  id: string
  /** Build the Unit refers to. */
  build: { kind: string, id: string }
  /** Loadout as catalog codes. */
  loadout: { armor: number, primary: number, secondary: number | null, utility: (number | null)[], modules: (number | null)[] }
}

/**
 * Saves a Squad with the Units before the first page load, as the only and open Squad.
 *
 * @param page browser page.
 * @param units Units of the Squad.
 */
export const seedSquad = (page: Page, units: SeededUnit[]) => page.addInitScript((seededUnits) => {
  if (sessionStorage.getItem('seeded')) return;

  localStorage.setItem('lwr-tools.squads.v1.order', JSON.stringify(['seeded']));
  localStorage.setItem('lwr-tools.squads.v1.squad.seeded', JSON.stringify({ name: 'Seeded', units: seededUnits }));
  localStorage.setItem('lwr-tools.squads.v1.open', 'seeded');
  sessionStorage.setItem('seeded', 'true');
}, units);

/**
 * Notifications region of the page.
 *
 * @param page browser page.
 */
export const notifications = (page: Page) => page.getByRole('region', { name: /^Notifications/ });
