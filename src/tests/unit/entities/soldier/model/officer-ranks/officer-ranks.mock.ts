import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { OfficerRankContent } from '@entities/soldier/model/officer-ranks';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'alpha-left': { code: 40, name: 'Alpha Left', description: 'Left alpha option.' },
  'alpha-right': { code: 41, name: 'Alpha Right', description: 'Right alpha option.' },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
};

export const ALPHA_CONTENT: OfficerRankContent = { name: 'Alpha', abbreviation: 'A', requiredRank: 'second', perks: ['alpha-left', 'unknown', 'alpha-right'] };

/** Officer rank record requiring a rank the soldier ranks do not have. */
export const STRANGER_CONTENT: OfficerRankContent = { name: 'Stranger', abbreviation: 'S', requiredRank: 'missing', perks: [] };
