import { describe, expect, it } from 'vitest';

import { SHIV_PERK_CONTENT } from '@entities/shiv/config/constants/perk-content';
import { TECHNOLOGY_LEVEL_CONTENT } from '@entities/shiv/config/constants/technology-level-content';

import { shivContentSchema } from './data.schema';

/**
 * Perks offered on each technology level, in level order. SHIV share codes keep perks without their levels, and the
 * tree layout of the game is taken as fixed: a mod update that changes these numbers needs its own decision.
 */
const LEVEL_PERK_COUNTS = [
  ['base-configuration', 3],
  ['advancements-1', 3],
  ['advancements-2', 3],
  ['advancements-3a', 3],
  ['advancements-3b', 3],
];

describe('shiv content data', () => {
  it('matches the content schema', () => {
    const content = {
      perks: SHIV_PERK_CONTENT,
      levels: TECHNOLOGY_LEVEL_CONTENT,
    };

    const result = shivContentSchema.safeParse(content);

    expect(result.error?.issues ?? []).toEqual([]);
  });

  it('keeps the number of perks on each technology level', () => {
    const levels = Object.entries(TECHNOLOGY_LEVEL_CONTENT);

    const perkCounts = levels.map(([levelId, level]) => [levelId, level.perks.length]);

    expect(perkCounts).toEqual(LEVEL_PERK_COUNTS);
  });
});
