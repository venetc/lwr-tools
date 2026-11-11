import { describe, expect, it, vi } from 'vitest';

import { weaponsFromEntry } from '@entities/loadout/model/weapons';

import { UNKNOWN_TIER_ENTRY, UNTIERED_ENTRY } from './weapons.mock';

vi.mock('@entities/loadout/config/constants/weapon-icons', () => ({ WEAPON_ICON: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-content', () => ({ LOADOUT_ABILITY_CONTENT: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-icons', () => ({ LOADOUT_ABILITY_ICON: {} }));

describe('weaponsFromEntry', () => {
  it('builds a weapon without a tier as having no tier', () => {
    const weapons = weaponsFromEntry(UNTIERED_ENTRY);

    expect(weapons).toMatchObject([{ id: 'arc-rifle', tier: null }]);
  });

  it('skips a weapon of an unknown tier', () => {
    const weapons = weaponsFromEntry(UNKNOWN_TIER_ENTRY);

    expect(weapons).toEqual([]);
  });
});
