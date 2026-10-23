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
 * Stored Squad for seeding the Squad list.
 */
export interface SeededSquad {
  /** Squad id. */
  id: string
  /** Squad name. */
  name: string
  /** Units of the Squad. */
  units: SeededUnit[]
}

/**
 * Saves the Squads before the first page load, the first one open; later loads of the tab keep what the page saved.
 *
 * @param page browser page.
 * @param squads Squads in list order.
 */
export const seedSquads = (page: Page, squads: SeededSquad[]) => page.addInitScript((seededSquads) => {
  if (sessionStorage.getItem('seeded')) return;

  localStorage.setItem('lwr-tools.squads.v1.order', JSON.stringify(seededSquads.map(squad => squad.id)));

  for (const squad of seededSquads) {
    localStorage.setItem(`lwr-tools.squads.v1.squad.${squad.id}`, JSON.stringify({ name: squad.name, units: squad.units }));
  }

  localStorage.setItem('lwr-tools.squads.v1.open', seededSquads[0]?.id ?? '');
  sessionStorage.setItem('seeded', 'true');
}, squads);

/**
 * Saves a Squad with the Units before the first page load, as the only and open Squad.
 *
 * @param page browser page.
 * @param units Units of the Squad.
 */
export const seedSquad = (page: Page, units: SeededUnit[]) => seedSquads(page, [{ id: 'seeded', name: 'Seeded', units }]);

/**
 * Notifications region of the page.
 *
 * @param page browser page.
 */
export const notifications = (page: Page) => page.getByRole('region', { name: /^Notifications/ });

/**
 * Opens the Build dialog of the Unit from the mini-tree of its card and returns the dialog.
 *
 * @param page browser page.
 * @param card Unit card.
 * @param buildName build name of the Unit.
 */
export const openBuildDialog = async (page: Page, card: Locator, buildName: string) => {
  await card.getByRole('button', { name: `Edit ${buildName}`, exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Build' });

  await dialog.waitFor();

  return dialog;
};

/**
 * Step of the mini-tree of a Unit card: a rank, a body part, a psi level or a technology level.
 *
 * @param card Unit card.
 * @param label step and its ability, such as `Lance Corporal: Magnum` or `Lance Corporal: Empty`.
 */
export const miniTreeStep = (card: Locator, label: string) => card.getByRole('listitem', { name: label, exact: true });

/**
 * Loadout tile of a Unit card.
 *
 * @param card Unit card.
 * @param label slot and its item, such as `Armor: Tactical Vest` or `Utility: Empty`.
 */
export const loadoutTile = (card: Locator, label: string) => card.getByRole('button', { name: label, exact: true });

/**
 * Opens the Loadout dialog from a tile of the Unit card and returns the dialog.
 *
 * @param page browser page.
 * @param card Unit card.
 * @param label slot and its item on the tile.
 */
export const openLoadoutDialog = async (page: Page, card: Locator, label: string) => {
  await loadoutTile(card, label).first().click();

  const dialog = page.getByRole('dialog', { name: 'Loadout' });

  await dialog.waitFor();

  return dialog;
};

/**
 * Row of a slot in INVENTORY of the Loadout dialog.
 *
 * @param dialog Loadout dialog.
 * @param label slot and its item, such as `Armor: Tactical Vest`.
 */
export const inventoryRow = (dialog: Locator, label: string) => dialog.getByRole('button', { name: label, exact: true });

/**
 * Opens the Loadout dialog on a slot and shows its LOCKER: on a phone the INVENTORY row opens the LOCKER screen.
 *
 * @param page browser page.
 * @param card Unit card.
 * @param label slot and its item on the tile.
 */
export const openLocker = async (page: Page, card: Locator, label: string) => {
  const dialog = await openLoadoutDialog(page, card, label);

  await inventoryRow(dialog, label).first().click();

  return dialog;
};

/**
 * LOCKER list of the Loadout dialog.
 *
 * @param dialog Loadout dialog.
 */
export const locker = (dialog: Locator) => dialog.getByRole('list', { name: 'Locker' });

/**
 * Item of the LOCKER.
 *
 * @param dialog Loadout dialog.
 * @param label item name with its mark, such as `Ghost Armor, Needs Gene mod` or `Tactical Vest, Equipped`.
 */
export const lockerItem = (dialog: Locator, label: string) => locker(dialog).getByRole('button', { name: label, exact: true });

/**
 * Details of the picked item under the LOCKER.
 *
 * @param dialog Loadout dialog.
 */
export const itemDetails = (dialog: Locator) => dialog.getByRole('region', { name: 'Item details' });
