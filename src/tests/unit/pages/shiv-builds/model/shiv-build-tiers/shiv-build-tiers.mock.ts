import type { ShivPerkContent } from '@entities/shiv/model/perks';
import type { TechnologyLevelContent } from '@entities/shiv/model/technology-levels';
import type { ShivBuild } from '@pages/shiv-builds/model/shiv-builds';

export const SHIV_PERK_CONTENT_MOCK: Record<string, ShivPerkContent> = {
  left: { code: 1, name: 'Left', description: 'Left choice.' },
  right: { code: 2, name: 'Right', description: 'Right choice.' },
  top: { code: 3, name: 'Top', description: 'Top choice.' },
};

export const TECHNOLOGY_LEVEL_CONTENT_MOCK: Record<string, TechnologyLevelContent> = {
  first: { name: 'First', perks: ['left', 'right'] },
  second: { name: 'Second', perks: ['top'] },
};

/**
 * SHIV build with the selected perks.
 *
 * @param perks selected perks by technology level.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (perks: (string | null)[], readonly = false): ShivBuild => ({
  id: 'build',
  perks,
  name: 'SHIV',
  readonly,
});

export const FIRST_FILLED_PERKS = ['right', null];
