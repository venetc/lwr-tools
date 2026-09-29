import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';
import type { SoldierBuild } from '@pages/talents/model/talents';

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
  abilities: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  baseBuild: ['granted'],
} as unknown as SoldierClass;

/**
 * Build of the mock class.
 *
 * @param talents selected talents by rank.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (talents: string[], readonly = false): SoldierBuild => ({
  id: 'build',
  soldierClass: SOLDIER_CLASS_MOCK,
  talents,
  name: 'Tester',
  readonly,
});

export const BASE_TALENTS = ['granted'];

export const PARTIAL_TALENTS = ['granted', 'right'];
