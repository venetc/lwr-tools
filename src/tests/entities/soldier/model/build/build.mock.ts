import type { SoldierBuildData } from '@entities/soldier/model/build';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

export const SOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  abilities: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  baseBuild: ['granted'],
} as unknown as SoldierClass;

export const BASE_TALENTS = ['granted'];

export const FULL_TALENTS = ['granted', 'right', 'top'];

/**
 * Fresh build of the mock class with its own talents array.
 *
 * @param talents selected talents by rank.
 */
export const createBuildMock = (talents: string[]): SoldierBuildData => ({
  soldierClass: SOLDIER_CLASS_MOCK,
  talents: [...talents],
  name: 'Tester',
});
