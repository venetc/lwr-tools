import type { Locator, Page, Route } from '@playwright/test';

/**
 * Holds every image request of the page, so its images stay loading, until the returned function releases them;
 * requests made after the release go through. Call it before opening the page.
 *
 * @param page browser page.
 */
export const holdImages = async (page: Page) => {
  const heldRoutes: Route[] = [];
  let isHolding = true;

  await page.route('**/*', async (route) => {
    if (!isHolding || route.request().resourceType() !== 'image') return route.continue();

    heldRoutes.push(route);
  });

  /**
   * Lets the held requests and every later one through.
   */
  const release = async () => {
    isHolding = false;
    await Promise.all(heldRoutes.map(route => route.continue()));
  };

  return release;
};

/**
 * Background image of the element as the browser computes it: a gradient while an image shows its placeholder,
 * `none` once it has loaded.
 *
 * @param image image element.
 */
export const backgroundImage = (image: Locator) => image.evaluate(element => getComputedStyle(element).backgroundImage);

/**
 * Red, green and blue channels of the background colour of the image placeholder.
 *
 * @param image image element showing its placeholder.
 */
export const placeholderBackdrop = (image: Locator) => image.evaluate((element) => {
  const channels = getComputedStyle(element).backgroundColor.match(/\d+(\.\d+)?/g) ?? [];

  return channels.slice(0, 3).map(Number);
});

/**
 * Red, green and blue channels of a corner pixel of the image, the background of an icon, once it has loaded.
 *
 * @param image image element.
 */
export const imageCorner = async (image: Locator) => {
  await image.evaluate(element => (element as HTMLImageElement).decode());

  return image.evaluate((element) => {
    const picture = element as HTMLImageElement;
    const canvas = document.createElement('canvas');

    canvas.width = picture.naturalWidth;
    canvas.height = picture.naturalHeight;

    const context = canvas.getContext('2d');

    if (!context) return [];

    context.drawImage(picture, 0, 0);

    return Array.from(context.getImageData(2, 2, 1, 1).data.slice(0, 3));
  });
};

/**
 * Largest difference between the channels of two colours; the background of an upscaled icon is not exactly flat.
 *
 * @param first channels of the first colour.
 * @param second channels of the second colour.
 */
export const channelDistance = (first: number[], second: number[]) => {
  if (first.length !== 3 || second.length !== 3) return Number.POSITIVE_INFINITY;

  return Math.max(...first.map((channel, index) => Math.abs(channel - (second[index] ?? 0))));
};
