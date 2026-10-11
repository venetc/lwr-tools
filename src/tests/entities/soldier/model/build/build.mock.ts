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
  perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

export const BASE_PERKS = ['granted'];

export const FULL_PERKS = ['granted', 'right', 'top'];

/**
 * Fresh build of the mock class with its own perks array.
 *
 * @param perks selected perks by rank.
 */
export const createBuildMock = (perks: string[]): SoldierBuildData => ({
  soldierClass: SOLDIER_CLASS_MOCK,
  perks: [...perks],
  name: 'Tester',
});
