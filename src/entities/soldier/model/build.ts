import type { DeepReadonly } from '@shared/lib/object';

import { EMPTY_GENE_MODS } from '../config/constants/body-parts';
import { EMPTY_OFFICER_PERKS } from '../config/constants/officer-ranks';
import { EMPTY_PSIONIC_ABILITIES } from '../config/constants/psi-levels';
import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type { AbilityId, TreeAbility } from './abilities';
import { treeAbility } from './abilities';
import type { SelectedGeneMods } from './body-parts';
import { geneModBlockReason, officerPerkBlockReason, perkBlockReason, psionicAbilityBlockReason, signatureSkillBlockReason } from './build-rules';
import type { SelectedPerks } from './class-tree';
import type { SoldierClass } from './classes';
import type { SelectedOfficerPerks } from './officer-ranks';
import type { SelectedPsionicAbilities } from './psi-levels';

/**
 * Soldier build: class, selected perks, name and Signature skill, without editor state.
 */
export interface SoldierBuildData {
  /** Soldier class of the build. */
  soldierClass: SoldierClass
  /** Selected perks by rank, one entry per rank: the base perk first, null for an empty rank. */
  perks: SelectedPerks
  /** Build name shown in the heading. */
  name: string
  /** Signature skill: a perk of the class tree, selected in the build or not; null for none. */
  signatureSkill: AbilityId | null
}

/**
 * Biosoldier build: a soldier build with gene mods, psionic abilities and officer perks.
 */
export interface BiosoldierBuildData extends SoldierBuildData {
  /** Gene mods by body part; null for a body part without one. */
  geneMods: SelectedGeneMods
  /** Psionic abilities by psi level, from Awakened; null for a psi level without one. */
  psionicAbilities: SelectedPsionicAbilities
  /** Officer perks by officer rank, from Lieutenant; null for an officer rank without one. */
  officerPerks: SelectedOfficerPerks
}

/**
 * Branches a biosoldier build has beyond the class tree: none, gene mods, psionic abilities or both.
 */
export type BiosoldierBranchSet = 'plain' | 'gene-mods' | 'psionic' | 'both';

/**
 * What a biosoldier build has beyond its class.
 */
export interface BiosoldierBuildTraits {
  /** Whether any gene mod is selected, Neural Damping included. */
  hasGeneMod: boolean
  /** Whether any psionic ability is selected. */
  hasPsionicAbility: boolean
  /** Whether the build is an Officer: any officer perk is selected. */
  isOfficer: boolean
}

/**
 * Default build of the class: the base perk on the first rank, the other ranks empty, named after the class, without
 * a Signature skill.
 *
 * @param soldierClass biosoldier class or MEC class.
 */
export const defaultSoldierBuild = (soldierClass: DeepReadonly<SoldierClass>): SoldierBuildData => ({
  soldierClass,
  perks: SOLDIER_RANKS.map((_, rankIndex) => (rankIndex === 0 ? soldierClass.basePerk : null)),
  name: soldierClass.name,
  signatureSkill: null,
});

/**
 * Default build of the biosoldier class: the default soldier build without gene mods, psionic abilities or officer perks.
 *
 * @param soldierClass biosoldier class.
 */
export const defaultBiosoldierBuild = (soldierClass: DeepReadonly<SoldierClass>): BiosoldierBuildData => ({
  ...defaultSoldierBuild(soldierClass),
  geneMods: [...EMPTY_GENE_MODS],
  psionicAbilities: [...EMPTY_PSIONIC_ABILITIES],
  officerPerks: [...EMPTY_OFFICER_PERKS],
});

/**
 * Selects a perk on the rank of the build, replacing the other one, or clears the rank. Ranks are independent; a choice
 * that breaks a Build rule is ignored: the first rank, which holds the base perk, or a perk not offered on the rank of
 * the class tree.
 *
 * @param build soldier build; its perks are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param perkId selected perk id, or null to clear the rank selection.
 */
export const selectSoldierBuildPerk = (build: SoldierBuildData, rankIndex: number, perkId: string | null): void => {
  if (perkBlockReason(build, rankIndex, perkId)) return;

  build.perks[rankIndex] = perkId;
};

/**
 * Sets the Signature skill of the build, or clears it. It does not depend on the selections on the ranks; a perk that
 * breaks a Build rule is ignored: any ability but a perk of the class tree of the build.
 *
 * @param build soldier build; its Signature skill is mutated in place.
 * @param perkId perk id, or null to clear the Signature skill.
 */
export const selectSoldierBuildSignatureSkill = (build: SoldierBuildData, perkId: string | null): void => {
  if (signatureSkillBlockReason(build, perkId)) return;

  build.signatureSkill = perkId as AbilityId | null;
};

/**
 * Perk of the Signature skill of the build, to show; null without one or for a perk the class tree does not have.
 *
 * @param build soldier build.
 */
export const soldierBuildSignatureSkill = (build: Readonly<SoldierBuildData>): TreeAbility | null => {
  const { signatureSkill } = build;

  if (!signatureSkill || signatureSkillBlockReason(build, signatureSkill)) return null;

  return treeAbility(signatureSkill);
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
 * Selects a psionic ability on the psi level, replacing the other one, or clears the level. Psi levels are independent;
 * a choice that breaks a Build rule is ignored: any selection while Neural Damping is selected, or an ability of another
 * level.
 *
 * @param build biosoldier build; its psionic abilities are mutated in place.
 * @param levelIndex psi level index.
 * @param abilityId selected psionic ability id, or null to clear the level.
 */
export const selectBiosoldierBuildPsionicAbility = (build: BiosoldierBuildData, levelIndex: number, abilityId: string | null): void => {
  if (psionicAbilityBlockReason(build, levelIndex, abilityId)) return;

  build.psionicAbilities[levelIndex] = abilityId as AbilityId | null;
};

/**
 * Selects an officer perk on the officer rank, replacing the other one, or clears the officer rank. Officer ranks are
 * independent of each other and of the class tree; a choice that breaks a Build rule is ignored: an officer perk of
 * another officer rank.
 *
 * @param build biosoldier build; its officer perks are mutated in place.
 * @param officerRankIndex officer rank index.
 * @param perkId selected officer perk id, or null to clear the officer rank.
 */
export const selectBiosoldierBuildOfficerPerk = (build: BiosoldierBuildData, officerRankIndex: number, perkId: string | null): void => {
  if (officerPerkBlockReason(officerRankIndex, perkId)) return;

  build.officerPerks[officerRankIndex] = perkId as AbilityId | null;
};

/**
 * Traits of the biosoldier build beyond its class: any gene mod counts, Neural Damping included; any psionic ability;
 * any officer perk makes an Officer.
 *
 * @param build biosoldier build.
 */
export const biosoldierBuildTraits = (build: BiosoldierBuildData): BiosoldierBuildTraits => ({
  hasGeneMod: build.geneMods.some(geneModId => geneModId !== null),
  hasPsionicAbility: build.psionicAbilities.some(abilityId => abilityId !== null),
  isOfficer: build.officerPerks.some(perkId => perkId !== null),
});

/**
 * Branches of the biosoldier build, from its gene mod and psionic ability traits.
 *
 * @param build biosoldier build.
 */
export const biosoldierBuildBranchSet = (build: BiosoldierBuildData): BiosoldierBranchSet => {
  const { hasGeneMod, hasPsionicAbility } = biosoldierBuildTraits(build);

  if (hasGeneMod && hasPsionicAbility) return 'both';
  if (hasGeneMod) return 'gene-mods';
  if (hasPsionicAbility) return 'psionic';
  return 'plain';
};
