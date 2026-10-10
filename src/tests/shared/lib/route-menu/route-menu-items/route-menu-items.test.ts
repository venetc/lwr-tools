import { describe, expect, it } from 'vitest';

import { routeMenuItems } from '@shared/lib/route-menu';

import { createRouteMock, NO_MATCH_ROUTE, RECORDS, TITLED_LABELS, TITLED_PATHS } from './route-menu-items.mock';

describe('routeMenuItems', () => {
  it('labels titled records in their order and skips untitled ones', () => {
    const items = routeMenuItems(RECORDS, createRouteMock('/second'));

    expect(items.map(item => item.label)).toEqual(TITLED_LABELS);
  });

  it('links items to the record paths', () => {
    const items = routeMenuItems(RECORDS, createRouteMock('/second'));

    expect(items.map(item => item.to)).toEqual(TITLED_PATHS);
  });

  it('marks only the item of the deepest matched record as current', () => {
    const items = routeMenuItems(RECORDS, createRouteMock('/second'));

    expect(items.map(item => item.isCurrent)).toEqual([false, true]);
  });

  it('marks no item as current when nothing is matched', () => {
    const items = routeMenuItems(RECORDS, NO_MATCH_ROUTE);

    expect(items.some(item => item.isCurrent)).toBe(false);
  });
});
