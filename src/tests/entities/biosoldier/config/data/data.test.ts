import { describe, expect, it } from 'vitest';

import { ABILITY_CONTENT } from '@entities/biosoldier/config/constants/ability-content';
import { BIOSOLDIER_CLASS_CONTENT } from '@entities/biosoldier/config/constants/biosoldier-class-content';
import { SOLDIER_RANK_CONTENT } from '@entities/biosoldier/config/constants/soldier-rank-content';

import { biosoldierContentSchema } from './data.schema';

describe('biosoldier content data', () => {
  it('matches the content schema', () => {
    const content = {
      abilities: ABILITY_CONTENT,
      classes: BIOSOLDIER_CLASS_CONTENT,
      ranks: SOLDIER_RANK_CONTENT,
    };

    const result = biosoldierContentSchema.safeParse(content);

    expect(result.error?.issues ?? []).toEqual([]);
  });
});
