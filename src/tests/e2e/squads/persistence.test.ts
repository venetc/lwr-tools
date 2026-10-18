import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { addSquad, openSquads, removeSquad, renameSquad, squadItem, squadList } from '../utils/squads';
import { FIRST_SQUAD, NEW_NAME, SECOND_SQUAD } from './persistence.mock';

test.describe('Squads after a reload', () => {
  test('keep the name', async ({ page }) => {
    const title = await openSquads(page);
    await renameSquad(title, NEW_NAME);

    const reopened = await openSquads(page);

    await expect(reopened).toHaveValue(NEW_NAME);
  });

  test('keep a new Squad', async ({ page }) => {
    await openSquads(page);
    await addSquad(page);

    await openSquads(page);

    await expect(squadList(page).getByRole('listitem')).toHaveCount(2);
  });

  test('keep the open Squad', async ({ page }) => {
    await openSquads(page);
    await addSquad(page);

    const reopened = await openSquads(page);

    await expect(reopened).toHaveValue(SECOND_SQUAD);
  });

  test('keep a removed Squad removed', async ({ page }) => {
    await openSquads(page);
    await addSquad(page);
    await removeSquad(page, FIRST_SQUAD);

    await openSquads(page);

    await expect(squadList(page).getByRole('listitem')).toHaveCount(1);
  });
});

/**
 * Opens the Squad planner in the tab and in another one, and returns the other tab with the name fields of both.
 *
 * @description The tab is reopened before the other one opens, so its default Squad is saved first: two tabs that
 * both save the default Squad would cancel an edit made before the later save.
 *
 * @param page browser page.
 */
const openTwoTabs = async (page: Page) => {
  await openSquads(page);
  const title = await openSquads(page);
  const otherPage = await page.context().newPage();
  const otherTitle = await openSquads(otherPage);

  return { title, otherPage, otherTitle };
};

test.describe('Squads in two browser tabs', () => {
  test('show a Squad added in one tab in the other', async ({ page }) => {
    const { otherPage } = await openTwoTabs(page);

    await addSquad(page);

    await expect(squadItem(otherPage, SECOND_SQUAD, 0)).toBeVisible();
  });

  test('show a name changed in one tab in the other', async ({ page }) => {
    const { title, otherPage } = await openTwoTabs(page);

    await renameSquad(title, NEW_NAME);

    await expect(squadItem(otherPage, NEW_NAME, 0)).toBeVisible();
  });

  test('keep the open Squad of each tab', async ({ page }) => {
    const { otherTitle } = await openTwoTabs(page);

    await addSquad(page);

    await expect(otherTitle).toHaveValue(FIRST_SQUAD);
  });
});

test.describe('Default Squad', () => {
  test('is created once when two tabs open the Squad planner at once', async ({ page }) => {
    const otherPage = await page.context().newPage();
    await Promise.all([openSquads(page), openSquads(otherPage)]);

    await openSquads(page);

    await expect(squadList(page).getByRole('listitem')).toHaveCount(1);
  });
});
