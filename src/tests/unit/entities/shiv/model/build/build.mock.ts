import type { ShivBuildData } from '@entities/shiv/model/build';
import type { ShivPerkContent } from '@entities/shiv/model/perks';
import type { TechnologyLevelContent } from '@entities/shiv/model/technology-levels';

export const SHIV_PERK_CONTENT_MOCK: Record<string, ShivPerkContent> = {
  left: { code: 1, name: 'Left', description: 'Left description' },
  other: { code: 2, name: 'Other', description: 'Other description' },
  middle: { code: 3, name: 'Middle', description: 'Middle description' },
  right: { code: 4, name: 'Right', description: 'Right description' },
};

export const TECHNOLOGY_LEVEL_CONTENT_MOCK: Record<string, TechnologyLevelContent> = {
  first: { name: 'First', perks: ['left', 'other'] },
  second: { name: 'Second', perks: ['middle'] },
  third: { name: 'Third', perks: ['right'] },
};

export const EMPTY_PERKS = [null, null, null];

export const FILLED_PERKS = ['left', 'middle', 'right'];

/**
 * Fresh SHIV build with its own perks array.
 *
 * @param perks selected perk ids by technology level, null for an empty level.
 */
export const createBuildMock = (perks: (string | null)[]): ShivBuildData => ({
  perks: [...perks],
  name: 'SHIV',
});
