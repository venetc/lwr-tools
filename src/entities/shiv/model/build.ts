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
 * Selects a perk on the technology level of the build, replacing any other perk of that level, or clears the level.
 * Levels are independent; a level outside the build is ignored.
 *
 * @param build SHIV build; its perks are mutated in place.
 * @param levelIndex technology level index in the tree.
 * @param perkId selected perk id, or null to clear the level.
 */
export const selectShivBuildPerk = (build: ShivBuildData, levelIndex: number, perkId: string | null): void => {
  if (levelIndex < 0 || levelIndex >= build.perks.length) return;

  build.perks[levelIndex] = perkId;
};
