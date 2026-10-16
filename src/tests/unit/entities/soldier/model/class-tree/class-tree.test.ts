import { describe, expect, it } from 'vitest';

import { featuredPerk } from '@entities/soldier/model/class-tree';

import {
  BASE_PERK,
  EMPTY_TREE_MOCK,
  PARTIAL_BUILD,
  RIGHT_PERK,
  TREE_MOCK,
} from './class-tree.mock';

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
