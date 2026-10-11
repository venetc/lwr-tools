import { describe, expect, it } from 'vitest';

import { featuredPerk, rankState } from '@entities/biosoldier/model/class-tree';

import {
  BASE_BUILD,
  BASE_PERK,
  EMPTY_TREE_MOCK,
  PARTIAL_BUILD,
  RIGHT_PERK,
  TREE_MOCK,
} from './class-tree.mock';

describe('rankState', () => {
  it('gives completed for a rank below the build length', () => {
    const state = rankState(PARTIAL_BUILD, 1, false);

    expect(state).toBe('completed');
  });

  it('gives available for the next rank of an editable build', () => {
    const state = rankState(PARTIAL_BUILD, 2, false);

    expect(state).toBe('available');
  });

  it('gives locked for the next rank of a readonly build', () => {
    const state = rankState(PARTIAL_BUILD, 2, true);

    expect(state).toBe('locked');
  });

  it('gives locked for a rank after the next one', () => {
    const state = rankState(BASE_BUILD, 2, false);

    expect(state).toBe('locked');
  });
});

describe('featuredPerk', () => {
  it('gives the perk selected on the last completed rank', () => {
    const perk = featuredPerk(TREE_MOCK, PARTIAL_BUILD);

    expect(perk).toBe(RIGHT_PERK);
  });

  it('gives the first perk of the first rank for an empty build', () => {
    const perk = featuredPerk(TREE_MOCK, []);

    expect(perk).toBe(BASE_PERK);
  });

  it('gives null for an empty tree', () => {
    const perk = featuredPerk(EMPTY_TREE_MOCK, []);

    expect(perk).toBeNull();
  });
});
