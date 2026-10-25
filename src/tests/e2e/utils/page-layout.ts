import type { Locator, Page } from '@playwright/test';

/**
 * How far the page content sticks out of the viewport sideways, in pixels; zero or less means no horizontal scroll.
 *
 * @param page browser page.
 */
export const pageOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/**
 * How far the element sticks out of the container on any side, in pixels; zero or less means it fits inside.
 *
 * @param element element on the page.
 * @param container element that should hold it.
 */
export const overhang = async (element: Locator, container: Locator) => {
  const [inner, outer] = await Promise.all([element.boundingBox(), container.boundingBox()]);

  if (!inner || !outer) return Number.POSITIVE_INFINITY;

  return Math.max(
    outer.x - inner.x,
    outer.y - inner.y,
    inner.x + inner.width - (outer.x + outer.width),
    inner.y + inner.height - (outer.y + outer.height),
  );
};

/**
 * Distance between the vertical centers of two elements, in pixels, for checking that they sit on one row.
 *
 * @param first element on the page.
 * @param second element on the page.
 */
export const centerOffset = async (first: Locator, second: Locator) => {
  const [firstBox, secondBox] = await Promise.all([first.boundingBox(), second.boundingBox()]);

  if (!firstBox || !secondBox) return Number.POSITIVE_INFINITY;

  return Math.abs(firstBox.y + firstBox.height / 2 - (secondBox.y + secondBox.height / 2));
};

/**
 * How far the text of the elements runs past their own boxes, in pixels, the most of them; zero means none is cut.
 *
 * @param elements elements with text.
 */
export const textOverflow = (elements: Locator) => elements.evaluateAll(nodes => Math.max(0, ...nodes.map(node => node.scrollWidth - node.clientWidth)));
