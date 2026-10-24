import { describe, expect, it, vi } from 'vitest';

import { classTree, featuredPerk } from '@entities/soldier/model/class-tree';

import {
  BASE_BUILD,
  BASE_PERK,
  EMPTY_TREE_MOCK,
  GAPPED_BUILD,
  PARTIAL_BUILD,
  RIGHT_PERK,
  SOLDIER_CLASS_MOCK,
  TOP_PERK,
  TREE_MOCK,
} from './class-tree.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./class-tree.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./class-tree.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

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

describe('classTree', () => {
  it('names the tree after the class', () => {
    const tree = classTree(SOLDIER_CLASS_MOCK);

    expect(tree.name).toBe('Tester');
  });

  it('gives the ranks in rank order', () => {
    const tree = classTree(SOLDIER_CLASS_MOCK);

    expect(tree.ranks.map(rank => rank.name)).toEqual(['First', 'Second', 'Third']);
  });

  it('gives the perks of the class on each rank', () => {
    const tree = classTree(SOLDIER_CLASS_MOCK);

    expect(tree.ranks.map(rank => rank.perks.map(perk => perk.id))).toEqual([['granted'], ['left', 'right'], ['top']]);
  });

  it('gives the perks with their content', () => {
    const tree = classTree(SOLDIER_CLASS_MOCK);

    expect(tree.ranks[1]?.perks[1]?.name).toBe('Right');
  });
});
