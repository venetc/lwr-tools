import { expect, test } from '@playwright/test';

import { openBuildPanel } from '../utils/build-panel';
import { pageOverflow } from '../utils/page-layout';
import { PAGE_PATH, PANEL_NAME } from './phone-layout.mock';

test.describe('SHIV calculator on a phone', { tag: '@phone' }, () => {
  test('has no horizontal scroll', async ({ page }) => {
    await openBuildPanel(page, PAGE_PATH, PANEL_NAME);

    const overflow = await pageOverflow(page);

    expect(overflow).toBeLessThanOrEqual(0);
  });
});
