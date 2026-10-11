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

export interface TechnologyLevel {
  /** Technology level id. */
  id: TechnologyLevelId
  /** Level label as the game shows it. */
  name: string
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
export const featuredShivPerk = (levels: readonly TechnologyLevel[], perks: SelectedShivPerks): ShivPerk | null => {
  const levelIndex = perks.reduce((lastIndex, perkId, index) => (perkId === null ? lastIndex : index), -1);

  const selectedPerk = levels[levelIndex]?.perks.find(perk => perk.id === perks[levelIndex]) ?? null;

  return selectedPerk ?? levels[0]?.perks[0] ?? null;
};
