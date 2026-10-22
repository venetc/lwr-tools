import { TECHNOLOGY_LEVELS } from '../config/constants/technology-levels';

/**
 * Why a Build rule refuses a choice of a SHIV build: `not-offered`, the perk is not offered on the technology level,
 * or the level is outside the SHIV tree.
 */
export type ShivBuildBlockReason = 'not-offered';

/**
 * Why a perk cannot be selected on the technology level: each perk is offered on its own level of the SHIV tree,
 * one per level; levels are independent. Clearing a level (a null perk) is refused only outside the tree.
 *
 * @param levelIndex technology level index in the tree.
 * @param perkId perk id, or null to clear the level.
 * @returns the reason; null if the perk can be selected.
 */
export const shivPerkBlockReason = (levelIndex: number, perkId: string | null): ShivBuildBlockReason | null => {
  const level = TECHNOLOGY_LEVELS[levelIndex];

  if (!level) return 'not-offered';

  if (perkId === null) return null;

  if (!level.perks.some(perk => perk.id === perkId)) return 'not-offered';

  return null;
};
