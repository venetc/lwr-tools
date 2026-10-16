import { describe, expect, it } from 'vitest';

import { ARMOR_CONTENT } from '@entities/equipment/config/constants/armor-content';
import { EQUIPMENT_ABILITY_CONTENT } from '@entities/equipment/config/constants/equipment-ability-content';
import { EQUIPMENT_UNIT_CONTENT } from '@entities/equipment/config/constants/equipment-unit-content';
import { WEAPON_CONTENT } from '@entities/equipment/config/constants/weapon-content';

import { equipmentContentSchema } from './data.schema';

describe('equipment content data', () => {
  it('matches the content schema', () => {
    const content = {
      units: EQUIPMENT_UNIT_CONTENT,
      abilities: EQUIPMENT_ABILITY_CONTENT,
      armors: ARMOR_CONTENT,
      weapons: WEAPON_CONTENT,
    };

    const result = equipmentContentSchema.safeParse(content);

    expect(result.error?.issues ?? []).toEqual([]);
  });
});
