import type { DeepReadonly } from '@shared/lib/object';

import { EMPTY_GENE_MODS } from '../config/constants/body-parts';
import { OFFICER_RANKS } from '../config/constants/officer-ranks';
import type { AbilityId } from './abilities';
import type { SelectedGeneMods } from './body-parts';
import { geneModBlockReason, officerPerkBlockReason, perkBlockReason, psionicAbilityBlockReason } from './build-rules';
import type { SelectedPerks } from './class-tree';
import type { SoldierClass } from './classes';
import type { SelectedOfficerPerks } from './officer-ranks';
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
 * Default build of the class: only the base perk selected, named after the class.
 *
 * @param soldierClass biosoldier class or MEC class.
 */
export const defaultSoldierBuild = (soldierClass: DeepReadonly<SoldierClass>): SoldierBuildData => ({
  soldierClass,
  perks: [soldierClass.basePerk],
  name: soldierClass.name,
});

/**
 * Default build of the biosoldier class: the default soldier build without gene mods, psionic abilities or officer perks.
 *
 * @param soldierClass biosoldier class.
 */
export const defaultBiosoldierBuild = (soldierClass: DeepReadonly<SoldierClass>): BiosoldierBuildData => ({
  ...defaultSoldierBuild(soldierClass),
  geneMods: [...EMPTY_GENE_MODS],
  psionicAbilities: [],
  officerPerks: [],
});

/**
 * Selects a perk on the rank of the build, keeping higher ranks; clearing a rank clears all higher ranks too.
 * A choice that breaks a Build rule is ignored: the first rank, which holds the base perk, a rank after the available
 * one, or a perk not offered on the rank of the class tree.
 *
 * @param build soldier build; its perks are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param perkId selected perk id, or null to clear the rank selection.
 */
export const selectSoldierBuildPerk = (build: SoldierBuildData, rankIndex: number, perkId: string | null): void => {
  if (perkBlockReason(build, rankIndex, perkId)) return;

  if (perkId === null) {
    build.perks.length = rankIndex;
    return;
  }

  build.perks[rankIndex] = perkId;
};

/**
 * Selects a perk on the rank of the biosoldier build like a soldier build, then clears officer perks from the first
 * officer rank whose required rank the class tree no longer completes.
 *
 * @param build biosoldier build; its perks and officer perks are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param perkId selected perk id, or null to clear the rank selection.
 */
export const selectBiosoldierBuildPerk = (build: BiosoldierBuildData, rankIndex: number, perkId: string | null): void => {
  selectSoldierBuildPerk(build, rankIndex, perkId);

  if (perkId) return;

  const lostOfficerRankIndex = OFFICER_RANKS.findIndex((_, officerRankIndex) => (
    officerPerkBlockReason(build, officerRankIndex, null) === 'required-rank'
  ));

  if (lostOfficerRankIndex < 0 || lostOfficerRankIndex >= build.officerPerks.length) return;

  build.officerPerks.length = lostOfficerRankIndex;
};

/**
 * Selects a gene mod of the body part, replacing the other one, or clears the body part. Body parts are independent;
 * a choice that breaks a Build rule is ignored: a body part outside the build, a gene mod of another body part, or
 * Neural Damping while any psionic ability is selected.
 *
 * @param build biosoldier build; its gene mods are mutated in place.
 * @param bodyPartIndex body part index.
 * @param geneModId selected gene mod id, or null to clear the body part.
 */
export const selectBiosoldierBuildGeneMod = (build: BiosoldierBuildData, bodyPartIndex: number, geneModId: string | null): void => {
  if (geneModBlockReason(build, bodyPartIndex, geneModId)) return;

  build.geneMods[bodyPartIndex] = geneModId as AbilityId | null;
};

/**
 * Selects a psionic ability on the psi level, keeping higher levels; clearing a level clears all higher levels too.
 * A choice that breaks a Build rule is ignored: any selection while Neural Damping is selected, a level after the next
 * open one, or an ability of another level.
 *
 * @param build biosoldier build; its psionic abilities are mutated in place.
 * @param levelIndex psi level index.
 * @param abilityId selected psionic ability id, or null to clear the level.
 */
export const selectBiosoldierBuildPsionicAbility = (build: BiosoldierBuildData, levelIndex: number, abilityId: string | null): void => {
  if (psionicAbilityBlockReason(build, levelIndex, abilityId)) return;

  if (abilityId === null) {
    build.psionicAbilities.length = levelIndex;
    return;
  }

  build.psionicAbilities[levelIndex] = abilityId as AbilityId;
};

/**
 * Selects an officer perk on the officer rank, keeping higher officer ranks; clearing an officer rank clears all higher
 * ones too. A choice that breaks a Build rule is ignored: an officer rank whose required rank the class tree has not
 * completed, an officer rank after the next open one, or an officer perk of another officer rank.
 *
 * @param build biosoldier build; its officer perks are mutated in place.
 * @param officerRankIndex officer rank index.
 * @param perkId selected officer perk id, or null to clear the officer rank.
 */
export const selectBiosoldierBuildOfficerPerk = (build: BiosoldierBuildData, officerRankIndex: number, perkId: string | null): void => {
  if (officerPerkBlockReason(build, officerRankIndex, perkId)) return;

  if (perkId === null) {
    build.officerPerks.length = officerRankIndex;
    return;
  }

  build.officerPerks[officerRankIndex] = perkId as AbilityId;
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

/**
 * Whether the biosoldier build is an Officer: at least one officer perk is selected.
 *
 * @param build biosoldier build.
 */
export const isOfficerBuild = (build: BiosoldierBuildData) => build.officerPerks.length > 0;
