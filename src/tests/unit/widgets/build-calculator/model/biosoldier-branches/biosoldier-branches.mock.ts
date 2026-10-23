import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { OfficerRankContent } from '@entities/soldier/model/officer-ranks';
import type { PsiLevelContent } from '@entities/soldier/model/psi-levels';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';
import type { BiosoldierBuild } from '@widgets/build-calculator/model/biosoldier-builds';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'granted': { code: 10, name: 'Granted', description: 'Granted by the class.' },
  'left': { code: 11, name: 'Left', description: 'Left choice.' },
  'right': { code: 12, name: 'Right', description: 'Right choice.' },
  'neural-damping': { code: 20, name: 'Neural Damping', description: 'Damps the brain.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'feet-first': { code: 22, name: 'Feet First', description: 'First feet option.' },
  'feet-second': { code: 23, name: 'Feet Second', description: 'Second feet option.' },
  'low-left': { code: 30, name: 'Low Left', description: 'Left low option.' },
  'low-right': { code: 31, name: 'Low Right', description: 'Right low option.' },
  'alpha-left': { code: 40, name: 'Alpha Left', description: 'Left alpha option.' },
  'alpha-right': { code: 41, name: 'Alpha Right', description: 'Right alpha option.' },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
  feet: { name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
};

export const PSI_LEVEL_CONTENT_MOCK: Record<string, PsiLevelContent> = {
  low: { name: 'Low', abilities: ['low-left', 'low-right'] },
};

export const OFFICER_RANK_CONTENT_MOCK: Record<string, OfficerRankContent> = {
  alpha: { name: 'Alpha', abbreviation: 'A', requiredRank: 'second', perks: ['alpha-left', 'alpha-right'] },
};

const SOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  perks: { first: ['granted'], second: ['left', 'right'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

/**
 * Biosoldier build of the mock class.
 *
 * @param fields selections of the build that differ from an empty one.
 */
export const createBuildMock = (fields: Partial<Record<'perks' | 'geneMods' | 'psionicAbilities' | 'officerPerks', (string | null)[]> & { readonly: boolean }>) => ({
  id: 'build',
  soldierClass: SOLDIER_CLASS_MOCK,
  perks: ['granted'],
  geneMods: [null, null],
  psionicAbilities: [],
  officerPerks: [],
  name: 'Tester',
  readonly: false,
  ...fields,
} as BiosoldierBuild);

export const EMPTY_BUILD = createBuildMock({});

export const FILLED_BUILD = createBuildMock({
  perks: ['granted', 'right'],
  geneMods: [null, 'feet-second'],
  officerPerks: ['alpha-right'],
});

export const READONLY_FILLED_BUILD = { ...FILLED_BUILD, readonly: true };
