import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier/model/build';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { OfficerRankContent } from '@entities/soldier/model/officer-ranks';
import type { PsiLevelContent } from '@entities/soldier/model/psi-levels';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'neural-damping': { code: 20, name: 'Neural Damping', description: 'Damps the brain.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'feet-first': { code: 22, name: 'Feet First', description: 'First feet option.' },
  'feet-second': { code: 23, name: 'Feet Second', description: 'Second feet option.' },
  'low-left': { code: 30, name: 'Low Left', description: 'Left low option.' },
  'low-right': { code: 31, name: 'Low Right', description: 'Right low option.' },
  'high-left': { code: 33, name: 'High Left', description: 'Left high option.' },
  'alpha-left': { code: 40, name: 'Alpha Left', description: 'Left alpha option.' },
  'beta-left': { code: 42, name: 'Beta Left', description: 'Left beta option.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
  feet: { name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
};

export const PSI_LEVEL_CONTENT_MOCK: Record<string, PsiLevelContent> = {
  low: { name: 'Low', abilities: ['low-left', 'low-right'] },
  high: { name: 'High', abilities: ['high-left'] },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
};

export const OFFICER_RANK_CONTENT_MOCK: Record<string, OfficerRankContent> = {
  alpha: { name: 'Alpha', abbreviation: 'A', requiredRank: 'first', perks: ['alpha-left'] },
  beta: { name: 'Beta', abbreviation: 'B', requiredRank: 'first', perks: ['beta-left'] },
};

/**
 * Build with the gene mods and psionic abilities.
 *
 * @param geneMods gene mods by body part; null for an empty body part.
 * @param psionicAbilities psionic abilities by psi level; null for an empty psi level.
 */
export const createBuildMock = (geneMods: (string | null)[], psionicAbilities: (string | null)[]) => ({
  geneMods,
  psionicAbilities,
} as Pick<BiosoldierBuildData, 'geneMods' | 'psionicAbilities'>);

export const EMPTY_BUILD = createBuildMock([null, null], [null, null]);

/** Build with a psionic ability on the high psi level above an empty one. */
export const HIGH_PSIONIC_BUILD = createBuildMock([null, null], [null, 'high-left']);

/** Build with Neural Damping and without psionic abilities. */
export const NEURAL_DAMPING_BUILD = createBuildMock(['neural-damping', null], [null, null]);

/** Build of a class with the base perk on the first rank and Left or Right on the second. */
export const SOLDIER_BUILD = {
  soldierClass: { perks: { first: ['granted'], second: ['left', 'right'] } } as unknown as SoldierClass,
  perks: ['granted', null],
  name: 'Tester',
} as SoldierBuildData;
