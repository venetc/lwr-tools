import { BODY_PARTS, NEURAL_DAMPING_ID } from '../config/constants/body-parts';
import { OFFICER_RANKS } from '../config/constants/officer-ranks';
import { PSI_LEVELS } from '../config/constants/psi-levels';
import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type { BiosoldierBuildData, SoldierBuildData } from './build';

/**
 * Why a Build rule refuses a choice:
 * - `base-perk`: the first rank holds the base perk;
 * - `not-offered`: the ability is not offered on the step, or the step is outside the tree; for the Signature skill, the
 *   class tree has no such perk;
 * - `neural-damping`: a psionic ability while Neural Damping is selected;
 * - `psionic-ability`: Neural Damping while a psionic ability is selected.
 */
export type BuildBlockReason = 'base-perk' | 'not-offered' | 'neural-damping' | 'psionic-ability';

/**
 * Why a perk cannot be selected on the rank: the first rank holds the base perk, and each perk is offered on its own
 * rank of the class tree; null if it can. Ranks are taken in any order; clearing a rank (a null perk) is refused only
 * for the first rank.
 *
 * @param build soldier build.
 * @param rankIndex rank index in the tree.
 * @param perkId perk id, or null to clear the rank.
 */
export const perkBlockReason = (build: Readonly<SoldierBuildData>, rankIndex: number, perkId: string | null): BuildBlockReason | null => {
  const rank = SOLDIER_RANKS[rankIndex];

  if (!rank) return 'not-offered';

  if (rankIndex === 0) return 'base-perk';

  if (perkId === null) return null;

  const offeredIds: readonly string[] = build.soldierClass.perks[rank.id];

  if (!offeredIds.includes(perkId)) return 'not-offered';

  return null;
};

/**
 * Why a perk cannot be the Signature skill of the build: the Signature skill is a perk of any rank of the class tree,
 * the base perk included, selected in the build or not; null if it can. Clearing the Signature skill (a null perk) is
 * always allowed.
 *
 * @param build soldier build: its class.
 * @param perkId perk id, or null to clear the Signature skill.
 */
export const signatureSkillBlockReason = (build: Readonly<Pick<SoldierBuildData, 'soldierClass'>>, perkId: string | null): BuildBlockReason | null => {
  if (perkId === null) return null;

  const isOffered = SOLDIER_RANKS.some((rank) => {
    const offeredIds: readonly string[] = build.soldierClass.perks[rank.id];

    return offeredIds.includes(perkId);
  });

  if (!isOffered) return 'not-offered';

  return null;
};

/**
 * Why a gene mod cannot be selected in the body part: each gene mod belongs to its own body part, and Neural Damping
 * excludes psionic abilities; null if it can. Clearing the body part (a null gene mod) is always allowed.
 *
 * @param build biosoldier build: its psionic abilities.
 * @param bodyPartIndex body part index.
 * @param geneModId gene mod id, or null to clear the body part.
 */
export const geneModBlockReason = (
  build: Readonly<Pick<BiosoldierBuildData, 'psionicAbilities'>>,
  bodyPartIndex: number,
  geneModId: string | null,
): BuildBlockReason | null => {
  const bodyPart = BODY_PARTS[bodyPartIndex];

  if (!bodyPart) return 'not-offered';

  if (geneModId === null) return null;

  const offeredIds: readonly string[] = bodyPart.geneMods;

  if (!offeredIds.includes(geneModId)) return 'not-offered';

  if (geneModId === NEURAL_DAMPING_ID && build.psionicAbilities.some(abilityId => abilityId !== null)) return 'psionic-ability';

  return null;
};

/**
 * Why a psionic ability cannot be selected on the psi level: Neural Damping excludes psionic abilities, and each ability
 * is offered on its own psi level; null if it can. Psi levels are taken in any order; a null ability asks about the psi
 * level itself: whether it can be cleared.
 *
 * @param build biosoldier build: its gene mods.
 * @param levelIndex psi level index.
 * @param abilityId psionic ability id, or null to clear the psi level.
 */
export const psionicAbilityBlockReason = (
  build: Readonly<Pick<BiosoldierBuildData, 'geneMods'>>,
  levelIndex: number,
  abilityId: string | null,
): BuildBlockReason | null => {
  const psiLevel = PSI_LEVELS[levelIndex];

  if (!psiLevel) return 'not-offered';

  if (build.geneMods.includes(NEURAL_DAMPING_ID)) return 'neural-damping';

  if (abilityId === null) return null;

  const offeredIds: readonly string[] = psiLevel.abilities;

  if (!offeredIds.includes(abilityId)) return 'not-offered';

  return null;
};

/**
 * Why an officer perk cannot be selected on the officer rank: each officer perk is offered on its own officer rank;
 * null if it can. Officer ranks are taken in any order and at any rank of the class tree; clearing an officer rank
 * (a null officer perk) is refused only outside the officer tree.
 *
 * @param officerRankIndex officer rank index.
 * @param perkId officer perk id, or null to clear the officer rank.
 */
export const officerPerkBlockReason = (officerRankIndex: number, perkId: string | null): BuildBlockReason | null => {
  const officerRank = OFFICER_RANKS[officerRankIndex];

  if (!officerRank) return 'not-offered';

  if (perkId === null) return null;

  const offeredIds: readonly string[] = officerRank.perks;

  if (!offeredIds.includes(perkId)) return 'not-offered';

  return null;
};
