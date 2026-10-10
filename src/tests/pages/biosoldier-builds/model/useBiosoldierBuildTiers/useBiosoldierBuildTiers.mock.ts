import type { AbilityContent } from '@entities/biosoldier/model/abilities';
import type { BiosoldierClass } from '@entities/biosoldier/model/classes';
import type { SoldierRankContent } from '@entities/biosoldier/model/ranks';
import type { BiosoldierBuild } from '@pages/biosoldier-builds/model/biosoldier-builds';

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

const BIOSOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  abilities: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  baseBuild: ['granted'],
} as unknown as BiosoldierClass;

/**
 * Build of the mock class.
 *
 * @param talents selected talents by rank.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (talents: string[], readonly = false): BiosoldierBuild => ({
  id: 'build',
  biosoldierClass: BIOSOLDIER_CLASS_MOCK,
  talents,
  name: 'Tester',
  readonly,
});

export const BASE_TALENTS = ['granted'];

export const PARTIAL_TALENTS = ['granted', 'right'];
