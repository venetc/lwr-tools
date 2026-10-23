import { describe, expect, it, vi } from 'vitest';

import { useBiosoldierBranches } from '@widgets/build-calculator/model/biosoldier-branches';

import { EMPTY_BUILD, FILLED_BUILD, READONLY_FILLED_BUILD } from './biosoldier-branches.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./biosoldier-branches.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./biosoldier-branches.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./biosoldier-branches.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/psi-level-content', async () => ({
  PSI_LEVEL_CONTENT: (await import('./biosoldier-branches.mock')).PSI_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/officer-rank-content', async () => ({
  OFFICER_RANK_CONTENT: (await import('./biosoldier-branches.mock')).OFFICER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/biosoldier-classes', () => ({ BIOSOLDIER_CLASSES: [] }));

vi.mock('@entities/soldier/config/constants/mec-classes', () => ({ MEC_CLASSES: [] }));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('useBiosoldierBranches', () => {
  it('lists the class tree, the gene mods, the psionic abilities and the officer perks in this order', () => {
    const { branches } = useBiosoldierBranches(EMPTY_BUILD);

    expect(branches.value.map(({ id }) => id)).toEqual(['class-tree', 'gene-mods', 'psionic', 'officer']);
  });

  it('counts the abilities selected in each branch', () => {
    const { branches } = useBiosoldierBranches(FILLED_BUILD);

    expect(branches.value.map(({ selectedCount }) => selectedCount)).toEqual([2, 1, 0, 1]);
  });

  it('counts the selected abilities of a readonly build, whose officer ranks are all locked', () => {
    const { branches } = useBiosoldierBranches(READONLY_FILLED_BUILD);

    expect(branches.value.map(({ selectedCount }) => selectedCount)).toEqual([2, 1, 0, 1]);
  });

  it('features an ability in each branch', () => {
    const { branches } = useBiosoldierBranches(FILLED_BUILD);

    expect(branches.value.map(({ featuredPickerItem }) => featuredPickerItem?.id)).toEqual(['right', 'feet-second', 'low-left', 'alpha-right']);
  });
});
