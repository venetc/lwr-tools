import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier/model/build';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { OfficerRankContent } from '@entities/soldier/model/officer-ranks';
import type { PsiLevelContent } from '@entities/soldier/model/psi-levels';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
  fourth: { name: 'Fourth' },
};

export const SOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  perks: { first: ['granted'], second: ['left', 'right'], third: ['top'], fourth: ['bottom'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

export const BASE_PERKS = ['granted', null, null, null];

export const PERKS_TO_THIRD = ['granted', 'right', 'top', null];

export const ALL_PERKS = ['granted', 'right', 'top', 'bottom'];

/**
 * Fresh build of the mock class with its own perks array.
 *
 * @param perks selected perks by rank; null for an empty rank.
 */
export const createBuildMock = (perks: (string | null)[]): SoldierBuildData => ({
  soldierClass: SOLDIER_CLASS_MOCK,
  perks: [...perks],
  name: 'Tester',
});

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'neural-damping': { code: 20, name: 'Neural Damping', description: 'Damps the brain.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'feet-first': { code: 22, name: 'Feet First', description: 'First feet option.' },
  'feet-second': { code: 23, name: 'Feet Second', description: 'Second feet option.' },
  'low-left': { code: 30, name: 'Low Left', description: 'Left low option.' },
  'low-right': { code: 31, name: 'Low Right', description: 'Right low option.' },
  'middle': { code: 32, name: 'Middle', description: 'Only middle option.' },
  'high-left': { code: 33, name: 'High Left', description: 'Left high option.' },
  'high-right': { code: 34, name: 'High Right', description: 'Right high option.' },
  'alpha-left': { code: 40, name: 'Alpha Left', description: 'Left alpha option.' },
  'alpha-right': { code: 41, name: 'Alpha Right', description: 'Right alpha option.' },
  'beta-left': { code: 42, name: 'Beta Left', description: 'Left beta option.' },
  'beta-right': { code: 43, name: 'Beta Right', description: 'Right beta option.' },
  'gamma-left': { code: 44, name: 'Gamma Left', description: 'Left gamma option.' },
  'gamma-right': { code: 45, name: 'Gamma Right', description: 'Right gamma option.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
  feet: { name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
};

export const PSI_LEVEL_CONTENT_MOCK: Record<string, PsiLevelContent> = {
  low: { name: 'Low', abilities: ['low-left', 'low-right'] },
  middle: { name: 'Middle', abilities: ['middle'] },
  high: { name: 'High', abilities: ['high-left', 'high-right'] },
};

export const NO_GENE_MODS = [null, null];

export const NEURAL_DAMPING_GENE_MODS = ['neural-damping', null];

export const FEET_GENE_MODS = [null, 'feet-second'];

export const NO_PSIONICS = [null, null, null];

export const NO_OFFICER_PERKS = [null, null, null];

export const LOW_AND_MIDDLE_PSIONICS = ['low-left', 'middle', null];

export const ALL_PSIONICS = ['low-left', 'middle', 'high-right'];

export const HIGH_PSIONICS = [null, null, 'high-right'];

/**
 * Fresh biosoldier build of the mock class with its own gene mods and psionic abilities arrays.
 *
 * @param geneMods gene mods by body part.
 * @param psionicAbilities psionic abilities by psi level; null for an empty psi level.
 */
export const createBiosoldierBuildMock = (geneMods: (string | null)[], psionicAbilities: (string | null)[] = NO_PSIONICS): BiosoldierBuildData => ({
  ...createBuildMock(BASE_PERKS),
  geneMods: [...geneMods] as BiosoldierBuildData['geneMods'],
  psionicAbilities: [...psionicAbilities] as BiosoldierBuildData['psionicAbilities'],
  officerPerks: [...NO_OFFICER_PERKS] as BiosoldierBuildData['officerPerks'],
});

export const OFFICER_RANK_CONTENT_MOCK: Record<string, OfficerRankContent> = {
  alpha: { name: 'Alpha', abbreviation: 'A', requiredRank: 'second', perks: ['alpha-left', 'alpha-right'] },
  beta: { name: 'Beta', abbreviation: 'B', requiredRank: 'third', perks: ['beta-left', 'beta-right'] },
  gamma: { name: 'Gamma', abbreviation: 'G', requiredRank: 'third', perks: ['gamma-left', 'gamma-right'] },
};

export const ALPHA_OFFICER_PERKS = ['alpha-left', null, null];

export const GAMMA_OFFICER_PERKS = [null, null, 'gamma-right'];

export const ALL_OFFICER_PERKS = ['alpha-left', 'beta-left', 'gamma-right'];

/**
 * Fresh biosoldier build of the mock class with its own perks and officer perks arrays.
 *
 * @param perks selected perks by rank; null for an empty rank.
 * @param officerPerks officer perks by officer rank; null for an empty officer rank.
 */
export const createOfficerBuildMock = (perks: (string | null)[], officerPerks: (string | null)[] = NO_OFFICER_PERKS): BiosoldierBuildData => ({
  ...createBiosoldierBuildMock(NO_GENE_MODS),
  perks: [...perks],
  officerPerks: [...officerPerks] as BiosoldierBuildData['officerPerks'],
});
