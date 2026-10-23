import type { ShivBuildData } from '@entities/shiv/model/build';
import type { ShivBuildCodes } from '@entities/shiv/model/build-codes';
import type { ShivPerkContent } from '@entities/shiv/model/perks';
import type { TechnologyLevelContent } from '@entities/shiv/model/technology-levels';

export const SHIV_PERK_CONTENT_MOCK: Record<string, ShivPerkContent> = {
  left: { code: 1, name: 'Left', description: 'Left description' },
  right: { code: 2, name: 'Right', description: 'Right description' },
  up: { code: 3, name: 'Up', description: 'Up description' },
  down: { code: 4, name: 'Down', description: 'Down description' },
  top: { code: 5, name: 'Top', description: 'Top description' },
  stray: { code: 6, name: 'Stray', description: 'Perk outside the tree' },
};

export const TECHNOLOGY_LEVEL_CONTENT_MOCK: Record<string, TechnologyLevelContent> = {
  first: { name: 'First', perks: ['left', 'right'] },
  second: { name: 'Second', perks: ['up', 'down'] },
  third: { name: 'Third', perks: ['top'] },
};

export const FULL_BUILD: ShivBuildData = { perks: ['right', 'up', 'top'], name: 'SHIV' };

export const FULL_CODES: ShivBuildCodes = { perks: [2, 3, 5], name: null };

export const REVERSED_CODES: ShivBuildCodes = { perks: [5, 3, 2], name: null };

export const PARTLY_FILLED_BUILD: ShivBuildData = { perks: [null, 'down', null], name: 'Tank' };

export const PARTLY_FILLED_CODES: ShivBuildCodes = { perks: [4], name: 'Tank' };

export const BLANK_NAME_CODES: ShivBuildCodes = { perks: [], name: ' ' };

export const UNKNOWN_PERK_CODES: ShivBuildCodes = { perks: [1, 40], name: null };

export const DUPLICATE_PERK_CODES: ShivBuildCodes = { perks: [3, 3], name: null };

export const STRAY_PERK_CODES: ShivBuildCodes = { perks: [3, 6], name: null };

export const STRAY_PERK_RESULT = {
  build: { perks: [null, 'up', null], name: 'SHIV' },
  outdated: [{ perkId: 'stray', reason: 'removed' }],
};

export const SAME_LEVEL_CODES: ShivBuildCodes = { perks: [5, 2, 1], name: null };

export const SAME_LEVEL_RESULT = {
  build: { perks: [null, null, 'top'], name: 'SHIV' },
  outdated: [{ perkId: 'right', reason: 'collision', levelIndex: 0 }, { perkId: 'left', reason: 'collision', levelIndex: 0 }],
};

export const MISPLACED_PERK_BUILD: ShivBuildData = { perks: ['up', null, null], name: 'SHIV' };

export const UNKNOWN_PERK_BUILD: ShivBuildData = { perks: ['missing', null, null], name: 'SHIV' };

export const BLANK_NAME_BUILD: ShivBuildData = { perks: [null, null, null], name: ' ' };

export const EXTRA_EMPTY_LEVEL_BUILD: ShivBuildData = { perks: ['right', 'up', 'top', null], name: 'SHIV' };
