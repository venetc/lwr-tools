import type { BiosoldierBuildData } from '@entities/biosoldier/model/build';
import type { BiosoldierClass } from '@entities/biosoldier/model/classes';
import type { SoldierRankContent } from '@entities/biosoldier/model/ranks';

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

export const BIOSOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  abilities: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  baseBuild: ['granted'],
} as unknown as BiosoldierClass;

export const BASE_TALENTS = ['granted'];

export const FULL_TALENTS = ['granted', 'right', 'top'];

/**
 * Fresh build of the mock class with its own talents array.
 *
 * @param talents selected talents by rank.
 */
export const createBuildMock = (talents: string[]): BiosoldierBuildData => ({
  biosoldierClass: BIOSOLDIER_CLASS_MOCK,
  talents: [...talents],
  name: 'Tester',
});
