import { expect, test } from '@playwright/test';

import { addSquad, openSquads, removeSquad, renameSquad, squadItem, squadList } from '../utils/squads';
import { ADD_UNIT_LABEL, EMPTY_SUMMARY, FIRST_SQUAD, NEW_NAME, SECOND_SQUAD } from './squad-management.mock';

test.describe('Squad management', () => {
  test('opens an empty Squad 1 on the first visit', async ({ page }) => {
    const title = await openSquads(page);

    await expect(title).toHaveValue(FIRST_SQUAD);
  });

  test('summarizes an empty Squad', async ({ page }) => {
    await openSquads(page);

    await expect(page.getByRole('main').getByText(EMPTY_SUMMARY, { exact: true })).toBeVisible();
  });

  test('shows only the inactive add cell in an empty Squad', async ({ page }) => {
    await openSquads(page);

    await expect(page.getByRole('main').getByRole('button', { name: ADD_UNIT_LABEL, exact: true })).toBeDisabled();
  });

  test('shows a new name in the Squad list', async ({ page }) => {
    const title = await openSquads(page);

    await renameSquad(title, NEW_NAME);

    await expect(squadItem(page, NEW_NAME, 0)).toBeVisible();
  });

  test('opens a new Squad 2', async ({ page }) => {
    const title = await openSquads(page);

    await addSquad(page);

    await expect(title).toHaveValue(SECOND_SQUAD);
  });

  test('marks the open Squad in the Squad list', async ({ page }) => {
    await openSquads(page);

    await addSquad(page);

    await expect(squadItem(page, SECOND_SQUAD, 0)).toHaveAttribute('aria-current', 'true');
  });

  test('switches to a Squad chosen in the Squad list', async ({ page }) => {
    const title = await openSquads(page);
    await addSquad(page);

    await squadItem(page, FIRST_SQUAD, 0).click();

    await expect(title).toHaveValue(FIRST_SQUAD);
  });

  test('removes a Squad', async ({ page }) => {
    await openSquads(page);
    await addSquad(page);

    await removeSquad(page, FIRST_SQUAD);

    await expect(squadList(page).getByRole('listitem')).toHaveCount(1);
  });

  test('keeps a Squad clicked without holding', async ({ page }) => {
    await openSquads(page);
    await addSquad(page);

    await squadList(page).getByRole('button', { name: `Remove ${FIRST_SQUAD}`, exact: true }).click();

    await expect(squadList(page).getByRole('listitem')).toHaveCount(2);
  });

  test('opens a new empty Squad 1 after the last one is removed', async ({ page }) => {
    const title = await openSquads(page);
    await renameSquad(title, NEW_NAME);

    await removeSquad(page, NEW_NAME);

    await expect(title).toHaveValue(FIRST_SQUAD);
  });
});
