import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { OfficerRankContent } from '@entities/soldier/model/officer-ranks';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';
import type { OfficerTreeBuild } from '@widgets/build-calculator/model/officer-tiers';

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'neural-damping': { code: 20, name: 'Neural Damping', description: 'Damps the brain.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'alpha-left': { code: 40, name: 'Alpha Left', description: 'Left alpha option.' },
  'alpha-right': { code: 41, name: 'Alpha Right', description: 'Right alpha option.' },
  'beta-left': { code: 42, name: 'Beta Left', description: 'Left beta option.' },
  'beta-right': { code: 43, name: 'Beta Right', description: 'Right beta option.' },
  'gamma-left': { code: 44, name: 'Gamma Left', description: 'Left gamma option.' },
  'gamma-right': { code: 45, name: 'Gamma Right', description: 'Right gamma option.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
};

export const OFFICER_RANK_CONTENT_MOCK: Record<string, OfficerRankContent> = {
  alpha: { name: 'Alpha', abbreviation: 'A', requiredRank: 'second', perks: ['alpha-left', 'alpha-right'] },
  beta: { name: 'Beta', abbreviation: 'B', requiredRank: 'third', perks: ['beta-left', 'beta-right'] },
  gamma: { name: 'Gamma', abbreviation: 'G', requiredRank: 'third', perks: ['gamma-left', 'gamma-right'] },
};

/**
 * Build with the perks and officer perks.
 *
 * @param perks selected perks by rank.
 * @param officerPerks officer perks by officer rank.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (perks: string[], officerPerks: string[], readonly = false): OfficerTreeBuild => ({
  perks,
  officerPerks: officerPerks as OfficerTreeBuild['officerPerks'],
  readonly,
});

/**
 * Build with Neural Damping and a psionic ability besides the perks and officer perks.
 *
 * @param perks selected perks by rank.
 * @param officerPerks officer perks by officer rank.
 */
export const createSuperSoldierBuildMock = (perks: string[], officerPerks: string[]): OfficerTreeBuild => ({
  ...createBuildMock(perks, officerPerks),
  geneMods: ['neural-damping'],
  psionicAbilities: ['mind-fray'],
} as OfficerTreeBuild);

export const BASE_PERKS = ['granted'];

export const SECOND_RANK_PERKS = ['granted', 'left'];

export const FULL_PERKS = ['granted', 'left', 'top'];

export const NO_OFFICER_PERKS = [];

export const ALPHA_OFFICER_PERKS = ['alpha-left'];

export const ALPHA_AND_BETA_OFFICER_PERKS = ['alpha-left', 'beta-right'];

export const ALL_OFFICER_PERKS = ['alpha-left', 'beta-right', 'gamma-left'];
