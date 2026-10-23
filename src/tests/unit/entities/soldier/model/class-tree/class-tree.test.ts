import { describe, expect, it } from 'vitest';

import { featuredPerk } from '@entities/soldier/model/class-tree';

import {
  BASE_BUILD,
  BASE_PERK,
  EMPTY_TREE_MOCK,
  GAPPED_BUILD,
  PARTIAL_BUILD,
  RIGHT_PERK,
  TOP_PERK,
  TREE_MOCK,
} from './class-tree.mock';

describe('featuredPerk', () => {
  it('gives the perk selected on the highest completed rank', () => {
    const perk = featuredPerk(TREE_MOCK, PARTIAL_BUILD);

    expect(perk).toBe(RIGHT_PERK);
  });

  it('gives the perk selected on the highest completed rank above an empty one', () => {
    const perk = featuredPerk(TREE_MOCK, GAPPED_BUILD);

    expect(perk).toBe(TOP_PERK);
  });

  it('gives the base perk for a build with only the base perk', () => {
    const perk = featuredPerk(TREE_MOCK, BASE_BUILD);

    expect(perk).toBe(BASE_PERK);
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
