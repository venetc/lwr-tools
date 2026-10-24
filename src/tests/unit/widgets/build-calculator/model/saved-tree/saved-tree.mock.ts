import type { ShivPerkContent } from '@entities/shiv/model/perks';
import type { TechnologyLevelContent } from '@entities/shiv/model/technology-levels';
import type { ShivBuild } from '@widgets/build-calculator/model/shiv-builds';

export const SHIV_PERK_CONTENT_MOCK: Record<string, ShivPerkContent> = {
  'lock-n-load': { code: 1, name: 'Left', description: 'Left choice.' },
  'repair-servos': { code: 2, name: 'Middle', description: 'Middle choice.' },
  'platform-stability': { code: 3, name: 'Right', description: 'Right choice.' },
  'holo-rounds': { code: 4, name: 'Top', description: 'Top choice.' },
  'smart-macrophages': { code: 5, name: 'Gone', description: 'Perk of no level.' },
};

export const TECHNOLOGY_LEVEL_CONTENT_MOCK: Record<string, TechnologyLevelContent> = {
  first: { name: 'First', perks: ['lock-n-load', 'repair-servos', 'platform-stability'] },
  second: { name: 'Second', perks: ['holo-rounds'] },
};

/** Outdated SHIV build with Left and Right colliding on First, Gone removed from the tree and Top kept; perk ids are real, their content is mocked. */
export const OUTDATED_SHIV_BUILD: ShivBuild = {
  id: 'build',
  perks: [null, 'holo-rounds'],
  name: 'SHIV',
  readonly: true,
  outdated: {
    code: 'code',
    selections: [
      { perkId: 'lock-n-load', reason: 'collision', levelIndex: 0 },
      { perkId: 'smart-macrophages', reason: 'removed' },
      { perkId: 'platform-stability', reason: 'collision', levelIndex: 0 },
    ],
  },
};

export const COLLISION_NOTE = 'Outdated selection: in this mod version Left and Right are both on First.';
