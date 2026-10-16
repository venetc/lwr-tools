import { describe, expect, it } from 'vitest';

import { featuredShivPerk } from '@entities/shiv/model/technology-levels';

import {
  EMPTY_PERKS,
  FILLED_PERKS,
  FIRST_PERK,
  LEVELS_MOCK,
  PARTLY_FILLED_PERKS,
  SECOND_PERK,
  THIRD_PERK,
} from './technology-levels.mock';

describe('featuredShivPerk', () => {
  it('gives the perk selected on the highest filled level', () => {
    const perk = featuredShivPerk(LEVELS_MOCK, PARTLY_FILLED_PERKS);

    expect(perk).toBe(SECOND_PERK);
  });

  it('prefers the highest level when several are filled', () => {
    const perk = featuredShivPerk(LEVELS_MOCK, FILLED_PERKS);

    expect(perk).toBe(THIRD_PERK);
  });

  it('gives the first perk of the first level for an empty build', () => {
    const perk = featuredShivPerk(LEVELS_MOCK, EMPTY_PERKS);

    expect(perk).toBe(FIRST_PERK);
  });

  it('gives null for an empty tree', () => {
    const perk = featuredShivPerk([], []);

    expect(perk).toBeNull();
  });
});
