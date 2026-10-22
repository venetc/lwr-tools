import { BODY_PARTS, NEURAL_DAMPING_ID } from '../config/constants/body-parts';
import { OFFICER_RANKS } from '../config/constants/officer-ranks';
import { PSI_LEVELS } from '../config/constants/psi-levels';
import type { SelectedGeneMods } from './body-parts';
import type { SelectedPerks } from './class-tree';
import type { SoldierClass } from './classes';
import type { SelectedOfficerPerks } from './officer-ranks';
import { hasRequiredRank } from './officer-ranks';
import type { SelectedPsionicAbilities } from './psi-levels';

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
 * Biosoldier build: a soldier build with gene mods, psionic abilities and officer perks.
 */
export interface BiosoldierBuildData extends SoldierBuildData {
  /** Gene mods by body part; null for a body part without one. */
  geneMods: SelectedGeneMods
  /** Psionic abilities by psi level, from Awakened, without gaps. */
  psionicAbilities: SelectedPsionicAbilities
  /** Officer perks by officer rank, from Lieutenant, without gaps. */
  officerPerks: SelectedOfficerPerks
}

/**
 * Branches a biosoldier build has beyond the class tree: none, gene mods, psionic abilities or both.
 */
export type BiosoldierBranchSet = 'plain' | 'gene-mods' | 'psionic' | 'both';

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

/**
 * Selects a gene mod of the body part, replacing the other one, or clears the body part. Body parts are independent;
 * a body part outside the build, a gene mod of another body part or Neural Damping while any psionic ability is selected
 * is ignored.
 *
 * @param build biosoldier build; its gene mods are mutated in place.
 * @param bodyPartIndex body part index.
 * @param geneModId selected gene mod id, or null to clear the body part.
 */
export const selectBiosoldierBuildGeneMod = (build: BiosoldierBuildData, bodyPartIndex: number, geneModId: string | null): void => {
  const bodyPart = BODY_PARTS[bodyPartIndex];

  if (!bodyPart) return;

  if (geneModId === null) {
    build.geneMods[bodyPartIndex] = null;
    return;
  }

  const geneMod = bodyPart.geneMods.find(id => id === geneModId);

  if (!geneMod) return;

  if (geneMod === NEURAL_DAMPING_ID && build.psionicAbilities.length > 0) return;

  build.geneMods[bodyPartIndex] = geneMod;
};

/**
 * Selects a psionic ability on the psi level, keeping higher levels; clearing a level clears all higher levels too.
 * A level after the next open one, an ability of another level or any selection while Neural Damping is selected
 * is ignored.
 *
 * @param build biosoldier build; its psionic abilities are mutated in place.
 * @param levelIndex psi level index.
 * @param abilityId selected psionic ability id, or null to clear the level.
 */
export const selectBiosoldierBuildPsionicAbility = (build: BiosoldierBuildData, levelIndex: number, abilityId: string | null): void => {
  if (build.geneMods.includes(NEURAL_DAMPING_ID)) return;

  if (levelIndex > build.psionicAbilities.length) return;

  const psiLevel = PSI_LEVELS[levelIndex];

  if (!psiLevel) return;

  if (abilityId === null) {
    build.psionicAbilities.length = levelIndex;
    return;
  }

  const ability = psiLevel.abilities.find(id => id === abilityId);

  if (!ability) return;

  build.psionicAbilities[levelIndex] = ability;
};

/**
 * Selects an officer perk on the officer rank, keeping higher officer ranks; clearing an officer rank clears all higher
 * ones too. An officer rank after the next open one, an officer rank whose required rank the class tree has not
 * completed, or an officer perk of another officer rank is ignored.
 *
 * @param build biosoldier build; its officer perks are mutated in place.
 * @param officerRankIndex officer rank index.
 * @param perkId selected officer perk id, or null to clear the officer rank.
 */
export const selectBiosoldierBuildOfficerPerk = (build: BiosoldierBuildData, officerRankIndex: number, perkId: string | null): void => {
  if (officerRankIndex > build.officerPerks.length) return;

  const officerRank = OFFICER_RANKS[officerRankIndex];

  if (!officerRank) return;

  if (!hasRequiredRank(officerRank, build.perks)) return;

  if (perkId === null) {
    build.officerPerks.length = officerRankIndex;
    return;
  }

  const perk = officerRank.perks.find(id => id === perkId);

  if (!perk) return;

  build.officerPerks[officerRankIndex] = perk;
};

/**
 * Branches of the biosoldier build: any gene mod counts as gene mods, Neural Damping included; any psionic ability as
 * psionic.
 *
 * @param build biosoldier build.
 */
export const biosoldierBuildBranchSet = (build: BiosoldierBuildData): BiosoldierBranchSet => {
  const hasGeneMods = build.geneMods.some(geneModId => geneModId !== null);
  const hasPsionicAbilities = build.psionicAbilities.length > 0;

  if (hasGeneMods && hasPsionicAbilities) return 'both';
  if (hasGeneMods) return 'gene-mods';
  if (hasPsionicAbilities) return 'psionic';
  return 'plain';
};
