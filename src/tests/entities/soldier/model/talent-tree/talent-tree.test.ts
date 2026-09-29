import { describe, expect, it } from 'vitest';

import { featuredTalent, talentRankState } from '@entities/soldier/model/talent-tree';

import {
  BASE_BUILD,
  EMPTY_TREE_MOCK,
  GRANTED_TALENT,
  PARTIAL_BUILD,
  RIGHT_TALENT,
  TREE_MOCK,
} from './talent-tree.mock';

describe('talentRankState', () => {
  it('gives completed for a rank below the build length', () => {
    const state = talentRankState(PARTIAL_BUILD, 1, false);

    expect(state).toBe('completed');
  });

  it('gives available for the next rank of an editable build', () => {
    const state = talentRankState(PARTIAL_BUILD, 2, false);

    expect(state).toBe('available');
  });

  it('gives locked for the next rank of a readonly build', () => {
    const state = talentRankState(PARTIAL_BUILD, 2, true);

    expect(state).toBe('locked');
  });

  it('gives locked for a rank after the next one', () => {
    const state = talentRankState(BASE_BUILD, 2, false);

    expect(state).toBe('locked');
  });
});

describe('featuredTalent', () => {
  it('gives the talent selected on the last completed rank', () => {
    const talent = featuredTalent(TREE_MOCK, PARTIAL_BUILD);

    expect(talent).toBe(RIGHT_TALENT);
  });

  it('gives the first talent of the first rank for an empty build', () => {
    const talent = featuredTalent(TREE_MOCK, []);

    expect(talent).toBe(GRANTED_TALENT);
  });

  it('gives null for an empty tree', () => {
    const talent = featuredTalent(EMPTY_TREE_MOCK, []);

    expect(talent).toBeNull();
  });
});
