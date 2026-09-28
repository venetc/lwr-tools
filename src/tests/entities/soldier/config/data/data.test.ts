import { describe, expect, it } from 'vitest';

import { ABILITY_CONTENT } from '@entities/soldier/config/constants/ability-content';
import { SOLDIER_CLASS_CONTENT } from '@entities/soldier/config/constants/soldier-class-content';
import { SOLDIER_RANK_CONTENT } from '@entities/soldier/config/constants/soldier-rank-content';

import { soldierContentSchema } from './data.schema';

describe('soldier content data', () => {
  it('matches the content schema', () => {
    const content = {
      abilities: ABILITY_CONTENT,
      classes: SOLDIER_CLASS_CONTENT,
      ranks: SOLDIER_RANK_CONTENT,
    };

    const result = soldierContentSchema.safeParse(content);

    expect(result.error?.issues ?? []).toEqual([]);
  });
});
