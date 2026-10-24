import { describe, expect, it } from 'vitest';

import { featuredShivPerk, technologyLevelState } from '@entities/shiv/model/technology-levels';

import {
  EMPTY_PERKS,
  FILLED_PERKS,
  FIRST_PERK,
  LEVELS_MOCK,
  PARTLY_FILLED_PERKS,
  SECOND_PERK,
  SELECTED_PERK,
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

describe('technologyLevelState', () => {
  it('gives completed for a level with a selection', () => {
    const state = technologyLevelState(SELECTED_PERK, false);

    expect(state).toBe('completed');
  });

  it('gives completed for a level with a selection of a readonly build', () => {
    const state = technologyLevelState(SELECTED_PERK, true);

    expect(state).toBe('completed');
  });

  it('gives available for an empty level of an editable build', () => {
    const state = technologyLevelState(null, false);

    expect(state).toBe('available');
  });

  it('gives locked for an empty level of a readonly build', () => {
    const state = technologyLevelState(null, true);

    expect(state).toBe('locked');
  });
});
