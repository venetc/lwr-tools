import { describe, expect, it } from 'vitest';

import { resolvePageHead } from '@shared/lib/page-head';

import { GUIDES_URL, IMAGE_URL, NESTED_JSON_LD, NESTED_TITLE, PAGE_TITLE, ROOT_JSON_LD, ROOT_TITLE, ROOT_URL, ROUTES, SITE, UNKNOWN_PATH } from './resolve-page-head.mock';

describe('resolvePageHead', () => {
  it('titles the root with the site name and tagline', () => {
    const head = resolvePageHead(ROUTES, SITE, '/');

    expect(head.title).toBe(ROOT_TITLE);
  });

  it('titles a page with its title, then the site name', () => {
    const head = resolvePageHead(ROUTES, SITE, '/guides');

    expect(head.title).toBe(PAGE_TITLE);
  });

  it('titles a nested page with the titled chain from it to the site name, skipping untitled ones', () => {
    const head = resolvePageHead(ROUTES, SITE, '/guides/untitled/deep');

    expect(head.title).toBe(NESTED_TITLE);
  });

  it('gives the root the site URL with a trailing slash as canonical', () => {
    const head = resolvePageHead(ROUTES, SITE, '/');

    expect(head.canonical).toBe(ROOT_URL);
  });

  it('gives a page an absolute canonical without a trailing slash', () => {
    const head = resolvePageHead(ROUTES, SITE, '/guides');

    expect(head.canonical).toBe(GUIDES_URL);
  });

  it('gives the preview image an absolute URL', () => {
    const head = resolvePageHead(ROUTES, SITE, '/guides');

    expect(head.image).toBe(IMAGE_URL);
  });

  it('describes the root as a web application', () => {
    const head = resolvePageHead(ROUTES, SITE, '/');

    expect(head.jsonLd).toEqual(ROOT_JSON_LD);
  });

  it('lists the titled chain of a nested page from the root as breadcrumbs', () => {
    const head = resolvePageHead(ROUTES, SITE, '/guides/untitled/deep');

    expect(head.jsonLd).toEqual(NESTED_JSON_LD);
  });

  it('keeps a path off the list out of the index', () => {
    const head = resolvePageHead(ROUTES, SITE, UNKNOWN_PATH);

    expect(head.robots).toBe('noindex');
  });

  it('gives a path off the list no canonical', () => {
    const head = resolvePageHead(ROUTES, SITE, UNKNOWN_PATH);

    expect(head.canonical).toBeNull();
  });

  it('titles a path off the list with the site name', () => {
    const head = resolvePageHead(ROUTES, SITE, UNKNOWN_PATH);

    expect(head.title).toBe(SITE.name);
  });

  it('lets a page on the list be indexed', () => {
    const head = resolvePageHead(ROUTES, SITE, '/guides');

    expect(head.robots).toBeNull();
  });
});
