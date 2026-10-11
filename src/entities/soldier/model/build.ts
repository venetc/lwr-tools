import type { SelectedPerks } from './class-tree';
import type { SoldierClass } from './classes';

/**
 * Soldier build: class, selected perks and name, without editor state.
 */
export interface SoldierBuildData {
  /** Soldier class of the build. */
  soldierClass: SoldierClass
  /** Selected perks by rank, including the base perk. */
  perks: SelectedPerks
  /** Build name shown in the heading. */
  name: string
}

/**
 * Selects a perk on the rank of the build, keeping higher ranks; clearing a rank clears all higher ranks too.
 * Leaves ranks after the available one and the first rank, which holds the base perk, untouched.
 *
 * @param build soldier build; its perks are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param perkId selected perk id, or null to clear the rank selection.
 */
export const selectSoldierBuildPerk = (build: SoldierBuildData, rankIndex: number, perkId: string | null): void => {
  if (rankIndex < 1) return;
  if (rankIndex > build.perks.length) return;
  if (perkId === null) {
    build.perks.length = rankIndex;
    return;
  }
  build.perks[rankIndex] = perkId;
};
