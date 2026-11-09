import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import {
  overhang,
  pageOverflow,
  scrollWindowTo,
  shortenViewport,
  textOverflow,
  waitForFonts,
  windowScroll,
} from '../utils/page-layout';
import {
  BIOSOLDIER,
  BRAND_NAME,
  HOME,
  MEC,
  NAV_NAME,
  NAV_PAGES,
  PHONE_HEIGHT,
  PHONE_WIDTHS,
  PLAIN_PAGES,
  ROOT_URL,
  SCROLL_OFFSET,
  SHORT_VIEWPORT_HEIGHT,
  SOURCES_TO_SQUADS,
  SQUADS,
} from './navigation.mock';

/**
 * Navigation landmark of the site header.
 *
 * @param page browser page.
 */
const siteNav = (page: Page) => page.getByRole('navigation', { name: NAV_NAME });

/**
 * Link of the site header navigation.
 *
 * @param page browser page.
 * @param label visible label of the link.
 */
const navLink = (page: Page, label: string) => siteNav(page).getByRole('link', { name: label, exact: true });

/**
 * Every link of the site header navigation.
 *
 * @param page browser page.
 */
const navLinks = (page: Page) => siteNav(page).getByRole('link');

/**
 * Site header.
 *
 * @param page browser page.
 */
const siteHeader = (page: Page) => page.getByRole('banner');

/**
 * How far the navigation links stick out of the site header on any side, in pixels, the most of them; zero or less
 * means every link fits inside. Infinite when there are no links, so that a missing navigation does not pass.
 *
 * @param page browser page.
 */
const navLinksOverhang = async (page: Page) => {
  const links = await navLinks(page).all();

  if (!links.length) return Number.POSITIVE_INFINITY;

  const overhangs = await Promise.all(links.map(link => overhang(link, siteHeader(page))));

  return Math.max(...overhangs);
};

test.describe('Site header navigation', () => {
  for (const target of NAV_PAGES) {
    test(`leads from the ${HOME.name} to ${target.label}`, async ({ page }) => {
      await page.goto(HOME.path);

      await navLink(page, target.label).click();

      await expect(page).toHaveURL(target.url);
    });
  }

  for (const source of SOURCES_TO_SQUADS) {
    test(`leads from the ${source.name} to ${SQUADS.label}`, async ({ page }) => {
      await page.goto(source.path);

      await navLink(page, SQUADS.label).click();

      await expect(page).toHaveURL(SQUADS.url);
    });
  }

  for (const current of NAV_PAGES) {
    test(`marks ${current.label} as the current page`, async ({ page }) => {
      await page.goto(current.path);

      const link = navLink(page, current.label);

      await expect(link).toHaveAttribute('aria-current', 'page');
    });
  }

  for (const plain of PLAIN_PAGES) {
    test(`marks no link as current on the ${plain.name}`, async ({ page }) => {
      await page.goto(plain.path);

      const plainLinks = navLinks(page).and(page.locator(':not([aria-current])'));

      await expect(plainLinks).toHaveCount(NAV_PAGES.length);
    });
  }
});

test.describe('Site header brand', () => {
  test('leads to the home page', async ({ page }) => {
    await page.goto(MEC.path);

    await siteHeader(page).getByRole('link', { name: BRAND_NAME, exact: true }).click();

    await expect(page).toHaveURL(ROOT_URL);
  });
});

test.describe('Site header scroll', () => {
  test('opens the next page at the top', async ({ page }) => {
    await shortenViewport(page, SHORT_VIEWPORT_HEIGHT);
    await page.goto(BIOSOLDIER.path);
    await scrollWindowTo(page, SCROLL_OFFSET);

    await navLink(page, MEC.label).click();
    await page.waitForURL(MEC.url);

    await expect.poll(() => windowScroll(page)).toBe(0);
  });

  test('restores the scroll of the previous page on Back', async ({ page }) => {
    await shortenViewport(page, SHORT_VIEWPORT_HEIGHT);
    await page.goto(BIOSOLDIER.path);
    await scrollWindowTo(page, SCROLL_OFFSET);
    await navLink(page, MEC.label).click();
    await page.waitForURL(MEC.url);

    await page.goBack();
    await page.waitForURL(BIOSOLDIER.url);

    await expect.poll(() => windowScroll(page)).toBe(SCROLL_OFFSET);
  });
});

test.describe('Site header on a phone', { tag: '@phone' }, () => {
  for (const width of PHONE_WIDTHS) {
    test(`keeps every navigation link inside the header at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: PHONE_HEIGHT });
      await page.goto(BIOSOLDIER.path);
      await waitForFonts(navLinks(page));

      const sticksOut = await navLinksOverhang(page);

      expect(sticksOut).toBeLessThanOrEqual(0);
    });

    test(`fits the header into the window at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: PHONE_HEIGHT });
      await page.goto(HOME.path);
      await waitForFonts(navLinks(page));

      const sideways = await pageOverflow(page);

      expect(sideways).toBeLessThanOrEqual(0);
    });

    test(`shows navigation labels uncut at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: PHONE_HEIGHT });
      await page.goto(BIOSOLDIER.path);
      await waitForFonts(navLinks(page));

      const cut = await textOverflow(navLinks(page));

      expect(cut).toBe(0);
    });
  }
});
