import type { SoldierClass } from './classes';
import type { TalentBuild } from './talent-tree';

/**
 * Soldier build: class, selected talents and name, without editor state.
 */
export interface SoldierBuildData {
  /** Soldier class of the build. */
  soldierClass: SoldierClass
  /** Selected talents by rank, including the granted ones. */
  talents: TalentBuild
  /** Build name shown in the heading. */
  name: string
}

/**
 * Selects a talent on the rank of the build, keeping higher ranks; clearing a rank clears all higher ranks too.
 * Leaves ranks after the available one and ranks granted with the class untouched.
 *
 * @param build soldier build; its talents are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param talentId selected talent id, or null to clear the rank selection.
 */
export const selectSoldierBuildTalent = (build: SoldierBuildData, rankIndex: number, talentId: string | null): void => {
  if (rankIndex < build.soldierClass.baseBuild.length) return;
  if (rankIndex > build.talents.length) return;
  if (talentId === null) {
    build.talents.length = rankIndex;
    return;
  }
  build.talents[rankIndex] = talentId;
};
