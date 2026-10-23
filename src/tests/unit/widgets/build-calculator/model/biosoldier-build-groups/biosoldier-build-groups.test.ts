import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed } from 'vue';

import { useBiosoldierBuildGroups } from '@widgets/build-calculator/model/biosoldier-build-groups';
import { useBiosoldierBuildsStore } from '@widgets/build-calculator/model/biosoldier-builds';

import { stubPage } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';
import { DEFAULT_ASSAULT_BUILD, DEFAULT_ASSAULT_ID } from '../biosoldier-builds/biosoldier-builds.mock';
import { BRANCH_SELECTIONS } from './biosoldier-build-groups.mock';

vi.mock('@entities/soldier', async () => (await import('../biosoldier-builds/biosoldier-builds.mock')).SOLDIER_ENTITY_MOCK);

vi.mock('@entities/shiv', () => ({ TECHNOLOGY_LEVELS: [] }));

vi.mock('@features/share-build', async () => (await import('../biosoldier-builds/biosoldier-builds.mock')).SHARE_BUILD_MOCK);

vi.mock('@widgets/build-calculator/model/biosoldier-branches', async () => {
  const { BRANCHES_MOCK } = await import('./biosoldier-build-groups.mock');

  return { useBiosoldierBranches: () => ({ tree: computed(() => ({ name: 'Assault' })), branches: computed(() => BRANCHES_MOCK) }) };
});

beforeEach(() => {
  setActivePinia(createPinia());
  stubPage();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/**
 * Tier groups of the Default Assault build of the store, with the store.
 */
const useAssaultGroups = () => {
  const store = useBiosoldierBuildsStore();

  return { store, ...useBiosoldierBuildGroups(() => store.builds[0]!) };
};

describe('useBiosoldierBuildGroups', () => {
  it.each(BRANCH_SELECTIONS)('selects an ability in the $branch branch', ({ branch, field, selected }) => {
    const { store, select } = useAssaultGroups();

    select(branch, 0, 'picked');

    expect(store.builds[0]?.[field]).toEqual(selected);
  });

  it('ignores a selection in an unknown branch', () => {
    const { store, select } = useAssaultGroups();

    select('unknown', 0, 'picked');

    expect(store.builds.find(({ id }) => id === DEFAULT_ASSAULT_ID)).toEqual(DEFAULT_ASSAULT_BUILD);
  });

  it('names each group by its branch with the abilities selected out of its tiers', () => {
    const { groups } = useAssaultGroups();

    expect(groups.value.map(({ name }) => name)).toEqual(['Class tree, 3 of 7', 'Gene mods, 0 of 5', 'Psionic, 2 of 6', 'Officer, 1 of 5']);
  });

  it('marks a group without selected abilities as empty', () => {
    const { groups } = useAssaultGroups();

    expect(groups.value.map(({ isEmpty }) => isEmpty)).toEqual([false, true, false, false]);
  });
});
