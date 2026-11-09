import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { pageOverflow } from '../utils/page-layout';
import { addSavedUnit, openSquads, unitCards } from '../utils/squads';
import {
  ADD_UNIT,
  ADD_UNIT_ROW_MAX_HEIGHT,
  BIOSOLDIER_BUILDS,
  CLASS_TREE_ROW,
  LOADOUT,
  MEC_BUILDS,
  NARROWEST_ROW_VIEWPORT,
  ROCKETEER,
  SHIV,
  SHIV_BUILDS,
  SHOGUN,
  WIDEST_STACKED_VIEWPORT,
} from './wide-layout.mock';

/**
 * Class tree row of the mini-tree of a Unit card.
 *
 * @param card Unit card.
 */
const classTree = (card: Locator) => card.getByRole('list', { name: CLASS_TREE_ROW, exact: true });

/**
 * Loadout tiles of a Unit card.
 *
 * @param card Unit card.
 */
const loadout = (card: Locator) => card.getByRole('list', { name: LOADOUT, exact: true });

/**
 * Column of a Unit card that holds the element: its ancestor right under the card.
 *
 * @param element element inside a column of a Unit card.
 */
const cardColumn = (element: Locator) => element.locator('xpath=ancestor::*[parent::article][1]');

test.describe('Squad planner on a wide screen', { tag: '@desktop' }, () => {
  test('shows Unit cards one per row', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);

    const [first, second] = await Promise.all([unitCards(page, ROCKETEER).boundingBox(), unitCards(page, SHIV).boundingBox()]);

    expect(second?.y).toBeGreaterThan((first?.y ?? 0) + (first?.height ?? 0));
  });

  test('lays the mini-tree out to the right of the heading', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);
    const card = unitCards(page, ROCKETEER);

    const [heading, tree] = await Promise.all([card.getByRole('heading').boundingBox(), classTree(card).boundingBox()]);

    expect(tree?.x).toBeGreaterThan((heading?.x ?? 0) + (heading?.width ?? 0));
  });

  test('lays the Loadout out to the right of the mini-tree', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);
    const card = unitCards(page, ROCKETEER);

    const [tree, tiles] = await Promise.all([classTree(card).boundingBox(), loadout(card).boundingBox()]);

    expect(tiles?.x).toBeGreaterThan((tree?.x ?? 0) + (tree?.width ?? 0));
  });

  test('keeps the steps of a Class tree in one line', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);

    const lineCount = await classTree(unitCards(page, ROCKETEER)).getByRole('listitem').evaluateAll(nodes => new Set(nodes.map(node => node.getBoundingClientRect().top)).size);

    expect(lineCount).toBe(1);
  });

  test('lines up the Loadouts of a biosoldier, a MEC and a SHIV', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);
    await addSavedUnit(page, MEC_BUILDS, SHOGUN);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);

    const lefts = await Promise.all([ROCKETEER, SHOGUN, SHIV].map(async name => (await loadout(unitCards(page, name)).boundingBox())?.x));

    expect(new Set(lefts).size).toBe(1);
  });

  test('stretches the mini-tree and the Loadout to one height, so the dividers run from top to bottom', async ({ page }) => {
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);

    const card = unitCards(page, ROCKETEER);

    const [tree, tiles] = await Promise.all([cardColumn(classTree(card)).boundingBox(), cardColumn(loadout(card)).boundingBox()]);

    expect(tree?.height).toBe(tiles?.height);
  });

  test('shows Add Unit as a low row', async ({ page }) => {
    await openSquads(page);

    const box = await page.getByRole('main').getByRole('button', { name: ADD_UNIT, exact: true }).boundingBox();

    expect(box?.height).toBeLessThanOrEqual(ADD_UNIT_ROW_MAX_HEIGHT);
  });

  test('has no horizontal scroll at the narrowest width of the row layout', async ({ page }) => {
    await page.setViewportSize(NARROWEST_ROW_VIEWPORT);
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);
    await addSavedUnit(page, SHIV_BUILDS, SHIV);
    await addSavedUnit(page, MEC_BUILDS, SHOGUN);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('stacks the Loadout under the mini-tree below the row layout width', async ({ page }) => {
    await page.setViewportSize(WIDEST_STACKED_VIEWPORT);
    await openSquads(page);
    await addSavedUnit(page, BIOSOLDIER_BUILDS, ROCKETEER);
    const card = unitCards(page, ROCKETEER);

    const [tree, tiles] = await Promise.all([classTree(card).boundingBox(), loadout(card).boundingBox()]);

    expect(tiles?.y).toBeGreaterThan((tree?.y ?? 0) + (tree?.height ?? 0));
  });
});
