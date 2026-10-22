import { SHIV_BUILD_NAME } from '../config/constants/build';
import { TECHNOLOGY_LEVELS } from '../config/constants/technology-levels';
import { shivPerkBlockReason } from './build-rules';

/**
 * Selected perk ids by technology level, from the first level; null for a level without a selection.
 */
export type SelectedShivPerks = (string | null)[];

/**
 * SHIV build: selected perks and name, without editor state.
 */
export interface ShivBuildData {
  /** Selected perks by technology level; the array has one entry per level. */
  perks: SelectedShivPerks
  /** Build name shown in the heading. */
  name: string
}

/**
 * Default build of a SHIV: no perk selected, the default name.
 */
export const defaultShivBuild = (): ShivBuildData => ({
  perks: TECHNOLOGY_LEVELS.map(() => null),
  name: SHIV_BUILD_NAME,
});

/**
 * Selects a perk on the technology level of the build, replacing any other perk of that level, or clears the level.
 * Levels are independent; a choice that breaks a Build rule is ignored: a level outside the SHIV tree or a perk not
 * offered on the level.
 *
 * @param build SHIV build; its perks are mutated in place.
 * @param levelIndex technology level index in the tree.
 * @param perkId selected perk id, or null to clear the level.
 */
export const selectShivBuildPerk = (build: ShivBuildData, levelIndex: number, perkId: string | null): void => {
  if (shivPerkBlockReason(levelIndex, perkId)) return;

  build.perks[levelIndex] = perkId;
};
