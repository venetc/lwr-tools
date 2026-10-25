import { expect, test } from '@playwright/test';

import { openBuildPanel, signatureSkillButton } from '../utils/build-panel';
import { PAGE_PATH, PANEL_NAME } from './signature-skill.mock';

test.describe('SHIV build panel', () => {
  test('has no Signature skill button', async ({ page }) => {
    const panel = await openBuildPanel(page, PAGE_PATH, PANEL_NAME);

    await expect(signatureSkillButton(panel)).toHaveCount(0);
  });
});
