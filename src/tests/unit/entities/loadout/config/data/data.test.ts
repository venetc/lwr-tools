import { describe, expect, it } from 'vitest';

import { ARMOR_CONTENT } from '@entities/loadout/config/constants/armor-content';
import { LOADOUT_ABILITY_CONTENT } from '@entities/loadout/config/constants/loadout-ability-content';
import { LOADOUT_UNIT_CONTENT } from '@entities/loadout/config/constants/loadout-unit-content';
import { SHIV_TYPE_CONTENT } from '@entities/loadout/config/constants/shiv-type-content';
import { WEAPON_CONTENT } from '@entities/loadout/config/constants/weapon-content';

import { loadoutContentSchema } from './data.schema';

describe('loadout content data', () => {
  it('matches the content schema', () => {
    const content = {
      units: LOADOUT_UNIT_CONTENT,
      abilities: LOADOUT_ABILITY_CONTENT,
      armors: ARMOR_CONTENT,
      shivTypes: SHIV_TYPE_CONTENT,
      weapons: WEAPON_CONTENT,
    };

    const result = loadoutContentSchema.safeParse(content);

    expect(result.error?.issues ?? []).toEqual([]);
  });
});
