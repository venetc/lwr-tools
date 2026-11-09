import type { Locator, Page } from '@playwright/test';

/**
 * Waits for the elements to appear, then loads the font faces their text is set in and waits for them, so that
 * the text is measured in its final font even if the page has not requested a face yet. Faces the elements do not
 * use are not loaded.
 *
 * @param elements elements with text.
 */
export const waitForFonts = async (elements: Locator) => {
  await elements.first().waitFor();
  await elements.evaluateAll(nodes => Promise.all(nodes.map((node) => {
    const style = getComputedStyle(node);

    return document.fonts.load(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`);
  })).then(() => null));
};

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

/**
 * How far the window is scrolled down, in pixels.
 *
 * @param page browser page.
 */
export const windowScroll = (page: Page) => page.evaluate(() => window.scrollY);

/**
 * Scrolls the window down to the offset once the page has grown tall enough for it, and waits until it is there.
 *
 * @param page browser page.
 * @param top offset from the top of the page, in pixels.
 */
export const scrollWindowTo = async (page: Page, top: number) => {
  await page.waitForFunction(offset => document.documentElement.scrollHeight - window.innerHeight >= offset, top);
  await page.evaluate(offset => window.scrollTo(0, offset), top);
  await page.waitForFunction(offset => window.scrollY === offset, top);
};

/**
 * Lowers the viewport keeping its width, so that a page is sure to scroll.
 *
 * @param page browser page.
 * @param height new height of the viewport, in pixels.
 */
export const shortenViewport = async (page: Page, height: number) => {
  const size = page.viewportSize();

  if (!size) return;

  await page.setViewportSize({ width: size.width, height });
};
