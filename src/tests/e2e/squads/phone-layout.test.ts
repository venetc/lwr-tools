import { expect, test } from '@playwright/test';

import { pageOverflow } from '../utils/page-layout';
import { addSquad, openSquads } from '../utils/squads';
import { SQUAD_COUNT } from './phone-layout.mock';

test.describe('Squad planner on a phone', () => {
  test.skip(({ isMobile }) => !isMobile, 'Phone layout only');

  test('has no horizontal scroll', async ({ page }) => {
    await openSquads(page);
    for (let index = 1; index < SQUAD_COUNT; index++) await addSquad(page);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });
});
