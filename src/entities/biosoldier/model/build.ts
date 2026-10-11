import type { SelectedPerks } from './class-tree';
import type { BiosoldierClass } from './classes';

/**
 * Biosoldier build: class, selected perks and name, without editor state.
 */
export interface BiosoldierBuildData {
  /** Biosoldier class of the build. */
  biosoldierClass: BiosoldierClass
  /** Selected perks by rank, including the base perk. */
  perks: SelectedPerks
  /** Build name shown in the heading. */
  name: string
}

/**
 * Selects a perk on the rank of the build, keeping higher ranks; clearing a rank clears all higher ranks too.
 * Leaves ranks after the available one and the first rank, which holds the base perk, untouched.
 *
 * @param build biosoldier build; its perks are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param perkId selected perk id, or null to clear the rank selection.
 */
export const selectBiosoldierBuildPerk = (build: BiosoldierBuildData, rankIndex: number, perkId: string | null): void => {
  if (rankIndex < 1) return;
  if (rankIndex > build.perks.length) return;
  if (perkId === null) {
    build.perks.length = rankIndex;
    return;
  }
  build.perks[rankIndex] = perkId;
};
