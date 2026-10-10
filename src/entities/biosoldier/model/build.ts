import type { BiosoldierClass } from './classes';
import type { TalentBuild } from './talent-tree';

/**
 * Biosoldier build: class, selected talents and name, without editor state.
 */
export interface BiosoldierBuildData {
  /** Biosoldier class of the build. */
  biosoldierClass: BiosoldierClass
  /** Selected talents by rank, including the granted ones. */
  talents: TalentBuild
  /** Build name shown in the heading. */
  name: string
}

/**
 * Selects a talent on the rank of the build, keeping higher ranks; clearing a rank clears all higher ranks too.
 * Leaves ranks after the available one and ranks granted with the class untouched.
 *
 * @param build biosoldier build; its talents are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param talentId selected talent id, or null to clear the rank selection.
 */
export const selectBiosoldierBuildTalent = (build: BiosoldierBuildData, rankIndex: number, talentId: string | null): void => {
  if (rankIndex < build.biosoldierClass.baseBuild.length) return;
  if (rankIndex > build.talents.length) return;
  if (talentId === null) {
    build.talents.length = rankIndex;
    return;
  }
  build.talents[rankIndex] = talentId;
};
