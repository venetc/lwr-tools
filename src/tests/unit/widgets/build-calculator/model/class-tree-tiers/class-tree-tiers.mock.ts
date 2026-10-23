import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';
import type { ClassTreeBuild } from '@widgets/build-calculator/model/class-tree-tiers';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  granted: { code: 10, name: 'Granted', description: 'Granted by the class.' },
  left: { code: 11, name: 'Left', description: 'Left choice.' },
  right: { code: 12, name: 'Right', description: 'Right choice.' },
  top: { code: 13, name: 'Top', description: 'Top choice.' },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

const SOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

/**
 * Build of the mock class.
 *
 * @param perks selected perks by rank.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (perks: string[], readonly = false): ClassTreeBuild => ({
  soldierClass: SOLDIER_CLASS_MOCK,
  perks,
  name: 'Tester',
  readonly,
});

export const BASE_PERKS = ['granted'];

export const PARTIAL_PERKS = ['granted', 'right'];
