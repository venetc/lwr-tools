import { describe, expect, it, vi } from 'vitest';

import { shivPerkById } from '@entities/shiv/model/perks';
import type { ShivPerkId } from '@entities/shiv/model/perks';

import { LEFT_PERK } from './perks.mock';

vi.mock('@entities/shiv/config/constants/perk-content', async () => ({
  SHIV_PERK_CONTENT: (await import('./perks.mock')).SHIV_PERK_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/perk-icons', async () => ({
  SHIV_PERK_ICON: (await import('./perks.mock')).SHIV_PERK_ICON_MOCK,
}));

describe('shivPerkById', () => {
  it('gives the perk with its content and icon', () => {
    const perk = shivPerkById('left' as ShivPerkId);

    expect(perk).toEqual(LEFT_PERK);
  });
});
