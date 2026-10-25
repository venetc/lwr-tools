import type { DeepReadonly } from '@shared/lib/object';

import { ABILITY_ID_BY_CODE } from '../config/constants/abilities';
import { ABILITY_CONTENT } from '../config/constants/ability-content';
import { BIOSOLDIER_CLASS_BY_CODE } from '../config/constants/biosoldier-classes';
import { GENE_MODS_BY_BODY_PART } from '../config/constants/body-parts';
import { MEC_CLASS_BY_CODE } from '../config/constants/mec-classes';
import { OFFICER_PERKS_BY_OFFICER_RANK } from '../config/constants/officer-ranks';
import { PSIONIC_ABILITIES_BY_PSI_LEVEL } from '../config/constants/psi-levels';
import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type { AbilityId } from './abilities';
import type { BiosoldierBuildData, SoldierBuildData } from './build';
import {
  defaultBiosoldierBuild,
  defaultSoldierBuild,
  selectBiosoldierBuildGeneMod,
  selectBiosoldierBuildOfficerPerk,
  selectBiosoldierBuildPsionicAbility,
  selectSoldierBuildPerk,
  selectSoldierBuildSignatureSkill,
} from './build';
import type { BuildBlockReason } from './build-rules';
import { geneModBlockReason, officerPerkBlockReason, perkBlockReason, psionicAbilityBlockReason, signatureSkillBlockReason } from './build-rules';
import type { SoldierClass } from './classes';

/**
 * Selection on a step of a build as stable codes: its place among the variants of the step and its ability.
 */
export interface SelectionCode {
  /** Index of the variant on the step, in tree order. */
  variantIndex: number
  /** Code of the ability. */
  code: number
}

/**
 * Selections of the steps of a tree as stable codes: one entry per step, null for an empty step.
 */
export type StepCodes = (SelectionCode | null)[];

/**
 * Soldier build as stable codes, in the shape of the build: what a share code of a MEC carries.
 */
export interface SoldierBuildCodes {
  /** Code of the class. */
  classCode: number
  /** Selections by rank, from the second rank: the base perk is left out. */
  perks: StepCodes
  /** Build name; null for the default name, the class name, or a blank one. */
  name: string | null
  /** Code of the perk of the Signature skill; null for none. */
  signatureSkill: number | null
}

/**
 * Biosoldier build as stable codes, in the shape of the build: what a share code of a biosoldier carries.
 */
export interface BiosoldierBuildCodes extends SoldierBuildCodes {
  /** Selections by body part, from Brain to Legs; empty for a build without gene mods. */
  geneMods: StepCodes
  /** Selections by psi level, from Awakened; empty for a build without psionic abilities. */
  psionicAbilities: StepCodes
  /** Selections by officer rank, from Lieutenant; empty for a build without officer perks. */
  officerPerks: StepCodes
}

/**
 * Kind of a step of a soldier build: a rank of the class tree, a body part, a psi level or an officer rank.
 */
export type SoldierStepKind = 'rank' | 'body-part' | 'psi-level' | 'officer-rank';

/**
 * Outdated selection of a soldier build code: a selection whose ability its step no longer offers, left out of the
 * build.
 */
export interface SoldierOutdatedSelection {
  /** Kind of the step. */
  stepKind: SoldierStepKind
  /** Index of the step in the build: of the rank from the first rank, of the body part, psi level or officer rank. */
  stepIndex: number
  /** Index of the variant on the step in the code. */
  variantIndex: number
  /** Ability of the code. */
  abilityId: AbilityId
  /** Ability the current tree has at the same place. */
  currentAbilityId: AbilityId
}

/**
 * Soldier build of stable codes and the selections of the codes left out of it.
 */
export interface SoldierBuildOfCodes<Build> {
  /** Build without the Outdated selections. */
  build: Build
  /** Outdated selections in tree order; empty if every selection stands on its step. */
  outdated: SoldierOutdatedSelection[]
}

/**
 * Selected ids by step; null for an empty step.
 */
type StepIds = readonly (string | null)[];

/**
 * Ability ids offered on each step of a tree, in tree order: the variants of the steps.
 */
type StepVariants = readonly (readonly AbilityId[])[];

/**
 * Selections of a soldier build beyond its class: perk ids by step and the Signature skill.
 */
interface SoldierSelections {
  /** Perk ids by rank, from the second rank. */
  perks: StepIds
  /** Perk id of the Signature skill; null for none. */
  signatureSkill: string | null
}

/**
 * Selections of a biosoldier build beyond its class, as ids by step, and the Signature skill.
 */
interface BiosoldierSelections extends SoldierSelections {
  /** Gene mod ids by body part. */
  geneMods: StepIds
  /** Psionic ability ids by psi level. */
  psionicAbilities: StepIds
  /** Officer perk ids by officer rank. */
  officerPerks: StepIds
}

/**
 * Takes the choices of the steps with the mutator, unless a Build rule refuses one; empty steps are skipped.
 *
 * @param build build; mutated in place.
 * @param stepIds ids by step.
 * @param blockReason Build rule check of a step.
 * @param select mutator of a step.
 * @param firstStepIndex index of the step of the first id.
 * @returns whether every choice is taken.
 */
const takeSteps = <Build>(
  build: Build,
  stepIds: StepIds,
  blockReason: (build: Build, stepIndex: number, id: string) => BuildBlockReason | null,
  select: (build: Build, stepIndex: number, id: string) => void,
  firstStepIndex: number,
) => stepIds.every((id, index) => {
  if (id === null) return true;

  if (blockReason(build, firstStepIndex + index, id)) return false;

  select(build, firstStepIndex + index, id);

  return true;
});

/**
 * Takes the Signature skill with the mutator, unless a Build rule refuses it; none is taken as none.
 *
 * @param build soldier build; mutated in place.
 * @param perkId perk id of the Signature skill; null for none.
 * @returns whether the Signature skill is taken.
 */
const takeSignatureSkill = (build: SoldierBuildData, perkId: string | null) => {
  if (signatureSkillBlockReason(build, perkId)) return false;

  selectSoldierBuildSignatureSkill(build, perkId);

  return true;
};

/**
 * Soldier build of the class assembled from its default build with the mutators, perk by perk, then the Signature
 * skill; null if a Build rule refuses a choice.
 *
 * @param soldierClass MEC class.
 * @param selections choices by step and the Signature skill.
 * @param name build name.
 */
const assembleSoldierBuild = (soldierClass: DeepReadonly<SoldierClass>, selections: SoldierSelections, name: string) => {
  const build = { ...defaultSoldierBuild(soldierClass), name };

  const isTaken = takeSteps(build, selections.perks, perkBlockReason, selectSoldierBuildPerk, 1)
    && takeSignatureSkill(build, selections.signatureSkill);

  if (!isTaken) return null;

  return build;
};

/**
 * Biosoldier build of the class assembled from its default build with the mutators: perks, gene mods, psionic abilities,
 * officer perks, then the Signature skill; null if a Build rule refuses a choice. Neural Damping comes before psionic abilities, so the
 * pair is refused.
 *
 * @param soldierClass biosoldier class.
 * @param selections choices by step.
 * @param name build name.
 */
const assembleBiosoldierBuild = (soldierClass: DeepReadonly<SoldierClass>, selections: BiosoldierSelections, name: string) => {
  const build = { ...defaultBiosoldierBuild(soldierClass), name };

  const isTaken = takeSteps(build, selections.perks, perkBlockReason, selectSoldierBuildPerk, 1)
    && takeSteps(build, selections.geneMods, geneModBlockReason, selectBiosoldierBuildGeneMod, 0)
    && takeSteps(build, selections.psionicAbilities, psionicAbilityBlockReason, selectBiosoldierBuildPsionicAbility, 0)
    && takeSteps(build, selections.officerPerks, (_, officerRankIndex, perkId) => officerPerkBlockReason(officerRankIndex, perkId), selectBiosoldierBuildOfficerPerk, 0)
    && takeSignatureSkill(build, selections.signatureSkill);

  if (!isTaken) return null;

  return build;
};

/**
 * Codes of the selections by step: each one as its variant index on the step and its ability code.
 *
 * @param stepIds selected ids by step.
 * @param variantsByStep variants of each step.
 * @returns the codes; null if the steps differ in number from the tree, or a selection is not offered on its step.
 */
const stepCodes = (stepIds: StepIds, variantsByStep: StepVariants) => {
  if (stepIds.length !== variantsByStep.length) return null;

  const codes: StepCodes = [];

  for (const [stepIndex, id] of stepIds.entries()) {
    if (id === null) {
      codes.push(null);
      continue;
    }

    const variants = variantsByStep[stepIndex] ?? [];
    const variantIndex = variants.findIndex(variantId => variantId === id);
    const abilityId = variants[variantIndex];

    if (!abilityId) return null;

    codes.push({ variantIndex, code: ABILITY_CONTENT[abilityId].code });
  }

  return codes;
};

/**
 * Codes of the selections of a branch beyond the class tree, as `stepCodes`, but empty for a branch without any.
 *
 * @param stepIds selected ids by step.
 * @param variantsByStep variants of each step.
 */
const branchCodes = (stepIds: StepIds, variantsByStep: StepVariants) => {
  if (stepIds.every(id => id === null)) return [];

  return stepCodes(stepIds, variantsByStep);
};

/**
 * Ids of the selections of the steps of a tree and the selections of the codes left out of them.
 */
interface StepIdsOfCodes {
  /** Ability ids by step; null for an empty step or an Outdated selection. */
  ids: (AbilityId | null)[]
  /** Outdated selections in step order. */
  outdated: SoldierOutdatedSelection[]
}

/**
 * Ids of the selections by step: the ability of the code wherever its step offers it, under the variant index of the
 * code or another one. An ability its step no longer offers is an Outdated selection, and the step stays empty.
 *
 * @param codes selections by step.
 * @param variantsByStep variants of each step.
 * @param stepKind kind of the steps.
 * @param firstStepIndex index of the step of the first code in the build.
 * @returns the ids and the Outdated selections; null if the steps differ in number from the tree, or a selection names
 * an unknown ability or a variant outside its step.
 */
const stepIdsOfCodes = (
  codes: Readonly<StepCodes>,
  variantsByStep: StepVariants,
  stepKind: SoldierStepKind,
  firstStepIndex: number,
): StepIdsOfCodes | null => {
  if (codes.length !== variantsByStep.length) return null;

  const result: StepIdsOfCodes = { ids: [], outdated: [] };

  for (const [index, selection] of codes.entries()) {
    if (!selection) {
      result.ids.push(null);
      continue;
    }

    const variants = variantsByStep[index] ?? [];
    const currentAbilityId = variants[selection.variantIndex] ?? null;
    const abilityId = ABILITY_ID_BY_CODE.get(selection.code) ?? null;

    if (!currentAbilityId || !abilityId) return null;

    if (variants.includes(abilityId)) {
      result.ids.push(abilityId);
      continue;
    }

    result.ids.push(null);
    result.outdated.push({ stepKind, stepIndex: firstStepIndex + index, variantIndex: selection.variantIndex, abilityId, currentAbilityId });
  }

  return result;
};

/**
 * Ids of the selections of a branch beyond the class tree, as `stepIdsOfCodes`, but every step empty for no codes.
 *
 * @param codes selections by step; empty for a branch without any.
 * @param variantsByStep variants of each step.
 * @param stepKind kind of the steps.
 */
const branchIdsOfCodes = (codes: Readonly<StepCodes>, variantsByStep: StepVariants, stepKind: SoldierStepKind): StepIdsOfCodes | null => {
  if (codes.length === 0) return { ids: variantsByStep.map(() => null), outdated: [] };

  return stepIdsOfCodes(codes, variantsByStep, stepKind, 0);
};

/**
 * Variants of the ranks of the class, from the second rank.
 *
 * @param soldierClass soldier class.
 */
const rankVariants = (soldierClass: DeepReadonly<SoldierClass>): StepVariants => SOLDIER_RANKS.slice(1).map(rank => soldierClass.perks[rank.id]);

/**
 * Build name of its code: the default name, the class name, for a missing or blank one.
 *
 * @param name name from the codes.
 * @param defaultName default build name.
 */
const nameOfCode = (name: string | null, defaultName: string) => (name?.trim() ? name : defaultName);

/**
 * Code of the build name: null for the default name, the class name, or a blank one.
 *
 * @param name build name.
 * @param defaultName default build name.
 */
const codeOfName = (name: string, defaultName: string) => (name.trim() && name !== defaultName ? name : null);

/**
 * Code of the Signature skill: the code of its perk; null for none.
 *
 * @param perkId perk id of the Signature skill; null for none.
 */
const codeOfSignatureSkill = (perkId: AbilityId | null) => (perkId && ABILITY_CONTENT[perkId].code);

/**
 * Signature skill of its code: the perk of the code, if the class tree has it. An unknown code or a perk gone from the
 * class tree leaves the Signature skill empty and is no Outdated selection.
 *
 * @param soldierClass soldier class.
 * @param code code of the perk of the Signature skill; null for none.
 * @returns the perk id; null for none.
 */
const signatureSkillOfCode = (soldierClass: DeepReadonly<SoldierClass>, code: number | null) => {
  if (!code) return null;

  const perkId = ABILITY_ID_BY_CODE.get(code) ?? null;

  if (signatureSkillBlockReason({ soldierClass }, perkId)) return null;

  return perkId;
};

/**
 * Class of the build among the classes of a kind, if the build starts as its default build.
 *
 * @param build soldier build.
 * @param classByCode classes of the kind by code.
 * @returns the class; null for a class of another kind or a first rank without the base perk.
 */
const buildClass = (build: Readonly<SoldierBuildData>, classByCode: ReadonlyMap<number, DeepReadonly<SoldierClass>>) => {
  const soldierClass = classByCode.get(build.soldierClass.code) ?? null;

  if (!soldierClass || build.perks[0] !== soldierClass.basePerk) return null;

  return soldierClass;
};

/**
 * MEC build as stable codes.
 *
 * @param build MEC build.
 * @returns the codes; null for a class of another kind, an unknown ability, steps that differ in number from the tree,
 * or a build that breaks a Build rule.
 */
export const mecBuildCodes = (build: Readonly<SoldierBuildData>): SoldierBuildCodes | null => {
  const soldierClass = buildClass(build, MEC_CLASS_BY_CODE);
  const selections: SoldierSelections = { perks: build.perks.slice(1), signatureSkill: build.signatureSkill };

  if (!soldierClass || !assembleSoldierBuild(soldierClass, selections, build.name)) return null;

  const perks = stepCodes(selections.perks, rankVariants(soldierClass));

  if (!perks) return null;

  return {
    classCode: soldierClass.code,
    perks,
    name: codeOfName(build.name, soldierClass.name),
    signatureSkill: codeOfSignatureSkill(build.signatureSkill),
  };
};

/**
 * MEC build of stable codes, assembled with the mutators by the Build rules. A perk its rank no longer offers is an
 * Outdated selection and stays out of the build; the base perk always comes from the current tree. A Signature skill
 * the class tree has no perk of is left empty and is no Outdated selection.
 *
 * @param codes MEC build codes.
 * @returns the build and its Outdated selections; null for an unknown code, a class of another kind, or steps or a
 * variant that the tree does not have.
 */
export const mecBuildFromCodes = (codes: Readonly<SoldierBuildCodes>): SoldierBuildOfCodes<SoldierBuildData> | null => {
  const soldierClass = MEC_CLASS_BY_CODE.get(codes.classCode) ?? null;
  const perks = soldierClass && stepIdsOfCodes(codes.perks, rankVariants(soldierClass), 'rank', 1);

  if (!soldierClass || !perks) return null;

  const selections: SoldierSelections = { perks: perks.ids, signatureSkill: signatureSkillOfCode(soldierClass, codes.signatureSkill) };
  const build = assembleSoldierBuild(soldierClass, selections, nameOfCode(codes.name, soldierClass.name));

  return build && { build, outdated: perks.outdated };
};

/**
 * Biosoldier build as stable codes.
 *
 * @param build biosoldier build.
 * @returns the codes; null for a class of another kind, an unknown ability, steps that differ in number from the tree,
 * or a build that breaks a Build rule.
 */
export const biosoldierBuildCodes = (build: Readonly<BiosoldierBuildData>): BiosoldierBuildCodes | null => {
  const soldierClass = buildClass(build, BIOSOLDIER_CLASS_BY_CODE);
  const selections: BiosoldierSelections = {
    perks: build.perks.slice(1),
    signatureSkill: build.signatureSkill,
    geneMods: build.geneMods,
    psionicAbilities: build.psionicAbilities,
    officerPerks: build.officerPerks,
  };

  if (!soldierClass || !assembleBiosoldierBuild(soldierClass, selections, build.name)) return null;

  const perks = stepCodes(selections.perks, rankVariants(soldierClass));
  const geneMods = branchCodes(selections.geneMods, GENE_MODS_BY_BODY_PART);
  const psionicAbilities = branchCodes(selections.psionicAbilities, PSIONIC_ABILITIES_BY_PSI_LEVEL);
  const officerPerks = branchCodes(selections.officerPerks, OFFICER_PERKS_BY_OFFICER_RANK);

  if (!perks || !geneMods || !psionicAbilities || !officerPerks) return null;

  return {
    classCode: soldierClass.code,
    perks,
    name: codeOfName(build.name, soldierClass.name),
    signatureSkill: codeOfSignatureSkill(build.signatureSkill),
    geneMods,
    psionicAbilities,
    officerPerks,
  };
};

/**
 * Biosoldier build of stable codes, assembled with the mutators by the Build rules. An ability its step no longer
 * offers is an Outdated selection and stays out of the build; the base perk always comes from the current tree. A
 * Signature skill the class tree has no perk of is left empty and is no Outdated selection.
 *
 * @param codes biosoldier build codes.
 * @returns the build and its Outdated selections in tree order: ranks, body parts, psi levels, officer ranks; null for
 * an unknown code, a class of another kind, steps or a variant that the tree does not have, or a choice a Build rule
 * refuses.
 */
export const biosoldierBuildFromCodes = (codes: Readonly<BiosoldierBuildCodes>): SoldierBuildOfCodes<BiosoldierBuildData> | null => {
  const soldierClass = BIOSOLDIER_CLASS_BY_CODE.get(codes.classCode) ?? null;
  const perks = soldierClass && stepIdsOfCodes(codes.perks, rankVariants(soldierClass), 'rank', 1);
  const geneMods = branchIdsOfCodes(codes.geneMods, GENE_MODS_BY_BODY_PART, 'body-part');
  const psionicAbilities = branchIdsOfCodes(codes.psionicAbilities, PSIONIC_ABILITIES_BY_PSI_LEVEL, 'psi-level');
  const officerPerks = branchIdsOfCodes(codes.officerPerks, OFFICER_PERKS_BY_OFFICER_RANK, 'officer-rank');

  if (!soldierClass || !perks || !geneMods || !psionicAbilities || !officerPerks) return null;

  const selections: BiosoldierSelections = {
    perks: perks.ids,
    signatureSkill: signatureSkillOfCode(soldierClass, codes.signatureSkill),
    geneMods: geneMods.ids,
    psionicAbilities: psionicAbilities.ids,
    officerPerks: officerPerks.ids,
  };
  const build = assembleBiosoldierBuild(soldierClass, selections, nameOfCode(codes.name, soldierClass.name));

  return build && { build, outdated: [...perks.outdated, ...geneMods.outdated, ...psionicAbilities.outdated, ...officerPerks.outdated] };
};
