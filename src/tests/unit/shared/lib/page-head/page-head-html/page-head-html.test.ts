import { describe, expect, it } from 'vitest';

import { pageHeadHtml } from '@shared/lib/page-head';

import {
  CANONICAL,
  CANONICAL_TAG,
  ESCAPED_DESCRIPTION,
  ESCAPED_JSON_LD,
  ESCAPED_TITLE,
  NOINDEX,
  OFF_LIST_HEAD,
  PAGE_HEAD,
} from './page-head-html.mock';

describe('pageHeadHtml', () => {
  it('escapes the title text', () => {
    const html = pageHeadHtml(PAGE_HEAD);

    expect(html).toContain(ESCAPED_TITLE);
  });

  it('escapes quotes and angle brackets in attributes', () => {
    const html = pageHeadHtml(PAGE_HEAD);

    expect(html).toContain(ESCAPED_DESCRIPTION);
  });

  it('keeps a closing script tag out of the structured data', () => {
    const html = pageHeadHtml(PAGE_HEAD);

    expect(html).toContain(ESCAPED_JSON_LD);
  });

  it('links the canonical URL', () => {
    const html = pageHeadHtml(PAGE_HEAD);

    expect(html).toContain(CANONICAL);
  });

  it('marks a head off the route list as noindex', () => {
    const html = pageHeadHtml(OFF_LIST_HEAD);

    expect(html).toContain(NOINDEX);
  });

  it('links no canonical URL off the route list', () => {
    const html = pageHeadHtml(OFF_LIST_HEAD);

    expect(html).not.toContain(CANONICAL_TAG);
  });
});
