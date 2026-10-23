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
} from './build';
import type { BuildBlockReason } from './build-rules';
import { geneModBlockReason, officerPerkBlockReason, perkBlockReason, psionicAbilityBlockReason } from './build-rules';
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
 * Selected ids by step; null for an empty step.
 */
type StepIds = readonly (string | null)[];

/**
 * Ability ids offered on each step of a tree, in tree order: the variants of the steps.
 */
type StepVariants = readonly (readonly AbilityId[])[];

/**
 * Selections of a biosoldier build beyond its class, as ids by step.
 */
interface BiosoldierSelections {
  /** Perk ids by rank, from the second rank. */
  perks: StepIds
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
 * Soldier build of the class assembled from its default build with the mutators, perk by perk; null if a Build rule
 * refuses a perk.
 *
 * @param soldierClass MEC class.
 * @param perkIds perk ids by rank, from the second rank.
 * @param name build name.
 */
const assembleSoldierBuild = (soldierClass: DeepReadonly<SoldierClass>, perkIds: StepIds, name: string) => {
  const build = { ...defaultSoldierBuild(soldierClass), name };

  if (!takeSteps(build, perkIds, perkBlockReason, selectSoldierBuildPerk, 1)) return null;

  return build;
};

/**
 * Biosoldier build of the class assembled from its default build with the mutators: perks, gene mods, psionic abilities,
 * then officer perks; null if a Build rule refuses a choice. Neural Damping comes before psionic abilities, so the
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
    && takeSteps(build, selections.officerPerks, (_, officerRankIndex, perkId) => officerPerkBlockReason(officerRankIndex, perkId), selectBiosoldierBuildOfficerPerk, 0);

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
 * Ids of the selections by step: each one is the variant of its step whose ability has the code.
 *
 * @param codes selections by step.
 * @param variantsByStep variants of each step.
 * @returns the ids; null if the steps differ in number from the tree, or a selection names a variant outside its step
 * or an ability other than the one the tree has there, unknown ones included.
 */
const stepIdsOfCodes = (codes: Readonly<StepCodes>, variantsByStep: StepVariants) => {
  if (codes.length !== variantsByStep.length) return null;

  const ids: (AbilityId | null)[] = [];

  for (const [stepIndex, selection] of codes.entries()) {
    if (!selection) {
      ids.push(null);
      continue;
    }

    const abilityId = variantsByStep[stepIndex]?.[selection.variantIndex] ?? null;

    if (!abilityId || ABILITY_ID_BY_CODE.get(selection.code) !== abilityId) return null;

    ids.push(abilityId);
  }

  return ids;
};

/**
 * Ids of the selections of a branch beyond the class tree, as `stepIdsOfCodes`, but every step empty for no codes.
 *
 * @param codes selections by step; empty for a branch without any.
 * @param variantsByStep variants of each step.
 */
const branchIdsOfCodes = (codes: Readonly<StepCodes>, variantsByStep: StepVariants) => {
  if (codes.length === 0) return variantsByStep.map(() => null);

  return stepIdsOfCodes(codes, variantsByStep);
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
  const perkIds = build.perks.slice(1);

  if (!soldierClass || !assembleSoldierBuild(soldierClass, perkIds, build.name)) return null;

  const perks = stepCodes(perkIds, rankVariants(soldierClass));

  if (!perks) return null;

  return { classCode: soldierClass.code, perks, name: codeOfName(build.name, soldierClass.name) };
};

/**
 * MEC build of stable codes, assembled with the mutators by the Build rules.
 *
 * @param codes MEC build codes.
 * @returns the build; null for an unknown code, a class of another kind, steps or a variant that the tree does not
 * have, or an ability other than the one the tree has on its place.
 */
export const mecBuildFromCodes = (codes: Readonly<SoldierBuildCodes>): SoldierBuildData | null => {
  const soldierClass = MEC_CLASS_BY_CODE.get(codes.classCode) ?? null;
  const perkIds = soldierClass && stepIdsOfCodes(codes.perks, rankVariants(soldierClass));

  if (!soldierClass || !perkIds) return null;

  return assembleSoldierBuild(soldierClass, perkIds, nameOfCode(codes.name, soldierClass.name));
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
    geneMods,
    psionicAbilities,
    officerPerks,
  };
};

/**
 * Biosoldier build of stable codes, assembled with the mutators by the Build rules.
 *
 * @param codes biosoldier build codes.
 * @returns the build; null for an unknown code, a class of another kind, steps or a variant that the tree does not
 * have, an ability other than the one the tree has on its place, or a choice a Build rule refuses.
 */
export const biosoldierBuildFromCodes = (codes: Readonly<BiosoldierBuildCodes>): BiosoldierBuildData | null => {
  const soldierClass = BIOSOLDIER_CLASS_BY_CODE.get(codes.classCode) ?? null;
  const perks = soldierClass && stepIdsOfCodes(codes.perks, rankVariants(soldierClass));
  const geneMods = branchIdsOfCodes(codes.geneMods, GENE_MODS_BY_BODY_PART);
  const psionicAbilities = branchIdsOfCodes(codes.psionicAbilities, PSIONIC_ABILITIES_BY_PSI_LEVEL);
  const officerPerks = branchIdsOfCodes(codes.officerPerks, OFFICER_PERKS_BY_OFFICER_RANK);

  if (!soldierClass || !perks || !geneMods || !psionicAbilities || !officerPerks) return null;

  const selections: BiosoldierSelections = { perks, geneMods, psionicAbilities, officerPerks };

  return assembleBiosoldierBuild(soldierClass, selections, nameOfCode(codes.name, soldierClass.name));
};
