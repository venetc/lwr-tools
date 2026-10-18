import type { DeepReadonly } from '@shared/lib/object';
import type { SvgIcon } from '@shared/ui/svg-icon';

import type technologyLevelsJson from '../config/data/technology-levels.json';
import type { SelectedShivPerks } from './build';
import type { ShivPerk } from './perks';

export type TechnologyLevelId = keyof typeof technologyLevelsJson;

/**
 * Technology level record of `technology-levels.json`.
 */
export interface TechnologyLevelContent {
  /** Level label as the game shows it. */
  name: string
  /** Perk ids of the level in game column order. */
  perks: readonly string[]
}

/**
 * Technology level state in a build: completed with a selection, available for selection, or locked.
 */
export type TechnologyLevelState = 'completed' | 'available' | 'locked';

export interface TechnologyLevel {
  /** Technology level id. */
  id: TechnologyLevelId
  /** Level label as the game shows it. */
  name: string
  /** Rank icon of the level, as on the wiki. */
  icon: SvgIcon
  /** Perks to choose from on the level, in game column order. */
  perks: ShivPerk[]
}

/**
 * Perk to show when the user inspects none: the one selected on the highest filled technology level,
 * otherwise the first perk of the first level; null for an empty tree.
 *
 * @param levels technology levels of the SHIV tree.
 * @param perks selected perks by technology level.
 */
export const featuredShivPerk = (levels: DeepReadonly<TechnologyLevel[]>, perks: SelectedShivPerks): DeepReadonly<ShivPerk> | null => {
  const levelIndex = perks.reduce((lastIndex, perkId, index) => (perkId === null ? lastIndex : index), -1);

  const selectedPerk = levels[levelIndex]?.perks.find(perk => perk.id === perks[levelIndex]);

  return selectedPerk ?? levels[0]?.perks[0] ?? null;
};

/**
 * Technology level state in a build. Levels are independent, so any level is open in an editable build;
 * a level with a selection is completed even in a readonly build, where empty levels are locked.
 *
 * @param selectedId id of the perk selected on the level, or null.
 * @param isReadonly whether the build is readonly.
 */
export const technologyLevelState = (selectedId: string | null, isReadonly: boolean): TechnologyLevelState => {
  if (selectedId !== null) return 'completed';
  if (isReadonly) return 'locked';
  return 'available';
};
