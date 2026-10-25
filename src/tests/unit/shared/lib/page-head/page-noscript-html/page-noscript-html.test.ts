import { describe, expect, it } from 'vitest';

import { pageNoscriptHtml } from '@shared/lib/page-head';

import {
  LINKS,
  PAGE_HEADING,
  PAGE_PARAGRAPH,
  PARAGRAPH_TAG,
  ROOT_HEADING,
  ROUTES,
  SITE,
  UNKNOWN_PATH,
} from './page-noscript-html.mock';

describe('pageNoscriptHtml', () => {
  it('heads a page with its title', () => {
    const html = pageNoscriptHtml(ROUTES, SITE, '/guides');

    expect(html).toContain(PAGE_HEADING);
  });

  it('heads the root with the site name', () => {
    const html = pageNoscriptHtml(ROUTES, SITE, '/');

    expect(html).toContain(ROOT_HEADING);
  });

  it('describes a page with an escaped paragraph', () => {
    const html = pageNoscriptHtml(ROUTES, SITE, '/guides');

    expect(html).toContain(PAGE_PARAGRAPH);
  });

  it('links every titled route, the root by the site name', () => {
    const html = pageNoscriptHtml(ROUTES, SITE, '/guides');

    expect(html).toContain(LINKS);
  });

  it('heads a path off the list with the site name', () => {
    const html = pageNoscriptHtml(ROUTES, SITE, UNKNOWN_PATH);

    expect(html).toContain(ROOT_HEADING);
  });

  it('describes nothing off the list', () => {
    const html = pageNoscriptHtml(ROUTES, SITE, UNKNOWN_PATH);

    expect(html).not.toContain(PARAGRAPH_TAG);
  });
});
