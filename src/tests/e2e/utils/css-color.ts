import type { Locator } from '@playwright/test';

/**
 * Text colour of the element as the browser computes it. Compare it only with another colour read the same way,
 * not with a literal: engines serialize colours differently, and the CSS minifier rounds what the styles compile to.
 *
 * @param locator element to read.
 */
export const textColor = (locator: Locator) => locator.evaluate(element => getComputedStyle(element).color);
