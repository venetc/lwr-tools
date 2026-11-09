import { describe, expect, it } from 'vitest';

import { routeMenuItems } from '@shared/lib/route-menu';

import { RECORDS, TITLED_LABELS, TITLED_PATHS } from './route-menu-items.mock';

describe('routeMenuItems', () => {
  it('labels titled records in their order and skips untitled ones', () => {
    const items = routeMenuItems(RECORDS);

    expect(items.map(item => item.label)).toEqual(TITLED_LABELS);
  });

  it('links items to the record paths', () => {
    const items = routeMenuItems(RECORDS);

    expect(items.map(item => item.to)).toEqual(TITLED_PATHS);
  });
});
