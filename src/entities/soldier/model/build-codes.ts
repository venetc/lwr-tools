import type { DeepReadonly } from '@shared/lib/object';

import { ABILITY_ID_BY_CODE } from '../config/constants/abilities';
import { ABILITY_CONTENT } from '../config/constants/ability-content';
import { BIOSOLDIER_CLASS_BY_CODE } from '../config/constants/biosoldier-classes';
import { BODY_PART_INDEX_BY_GENE_MOD, EMPTY_GENE_MODS } from '../config/constants/body-parts';
import { MEC_CLASS_BY_CODE } from '../config/constants/mec-classes';
import type { AbilityId } from './abilities';
import { isAbilityId } from './abilities';
import type { SelectedGeneMods } from './body-parts';
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
 * Soldier build as stable codes, in the shape of the build: what a share code of a MEC carries.
 */
export interface SoldierBuildCodes {
  /** Code of the class. */
  classCode: number
  /** Codes of the selected perks by rank, from the second rank: the base perk is left out. */
  perks: number[]
  /** Build name; null for the default name, the class name, or a blank one. */
  name: string | null
}

/**
 * Biosoldier build as stable codes, in the shape of the build: what a share code of a biosoldier carries.
 */
export interface BiosoldierBuildCodes extends SoldierBuildCodes {
  /** Codes of the gene mods by body part, from Brain to Legs; empty body parts are left out. */
  geneMods: number[]
  /** Codes of the psionic abilities by psi level, from Awakened. */
  psionicAbilities: number[]
  /** Codes of the officer perks by officer rank, from Lieutenant. */
  officerPerks: number[]
}

/**
 * Selections of a biosoldier build beyond its class, as ids by step.
 */
interface BiosoldierSelections {
  /** Perk ids by rank, from the second rank. */
  perks: readonly string[]
  /** Gene mod ids by body part; null for a body part without one. */
  geneModsByBodyPart: readonly (string | null)[]
  /** Psionic ability ids by psi level. */
  psionicAbilities: readonly string[]
  /** Officer perk ids by officer rank. */
  officerPerks: readonly string[]
}

/**
 * Takes a choice on a step of the build with its mutator, unless a Build rule refuses it.
 *
 * @param build build; mutated in place.
 * @param stepIndex step index: rank, body part, psi level or officer rank.
 * @param id id of the choice.
 * @param blockReason Build rule check of the step.
 * @param select mutator of the step.
 * @returns whether the choice is taken.
 */
const takeStep = <Build>(
  build: Build,
  stepIndex: number,
  id: string,
  blockReason: (build: Build, stepIndex: number, id: string) => BuildBlockReason | null,
  select: (build: Build, stepIndex: number, id: string) => void,
) => {
  if (blockReason(build, stepIndex, id)) return false;

  select(build, stepIndex, id);

  return true;
};

/**
 * Takes the perks rank by rank, from the second rank.
 *
 * @param build soldier build; its perks are mutated in place.
 * @param perkIds perk ids by rank, from the second rank.
 * @returns whether every perk is taken.
 */
const takePerks = (build: SoldierBuildData, perkIds: readonly string[]) => (
  perkIds.every((perkId, index) => takeStep(build, index + 1, perkId, perkBlockReason, selectSoldierBuildPerk))
);

/**
 * Soldier build of the class assembled from its default build with the mutators, perk by perk; null if a Build rule
 * refuses a perk.
 *
 * @param soldierClass MEC class.
 * @param perkIds perk ids by rank, from the second rank.
 * @param name build name.
 */
const assembleSoldierBuild = (soldierClass: DeepReadonly<SoldierClass>, perkIds: readonly string[], name: string) => {
  const build = { ...defaultSoldierBuild(soldierClass), name };

  if (!takePerks(build, perkIds)) return null;

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

  const isTaken = takePerks(build, selections.perks)
    && selections.geneModsByBodyPart.every((geneModId, bodyPartIndex) => (
      geneModId === null || takeStep(build, bodyPartIndex, geneModId, geneModBlockReason, selectBiosoldierBuildGeneMod)
    ))
    && selections.psionicAbilities.every((abilityId, levelIndex) => (
      takeStep(build, levelIndex, abilityId, psionicAbilityBlockReason, selectBiosoldierBuildPsionicAbility)
    ))
    && selections.officerPerks.every((perkId, officerRankIndex) => (
      takeStep(build, officerRankIndex, perkId, officerPerkBlockReason, selectBiosoldierBuildOfficerPerk)
    ));

  if (!isTaken) return null;

  return build;
};

/**
 * Ability ids of the codes.
 *
 * @param codes ability codes.
 * @returns the ids in code order; null if a code is unknown.
 */
const abilityIdsOfCodes = (codes: readonly number[]) => {
  const abilityIds = codes.map(code => ABILITY_ID_BY_CODE.get(code) ?? null);

  if (!abilityIds.every(abilityId => abilityId !== null)) return null;

  return abilityIds;
};

/**
 * Codes of the abilities.
 *
 * @param abilityIds ability ids.
 * @returns the codes in id order; null if an id is unknown.
 */
const abilityCodes = (abilityIds: readonly string[]) => {
  const codes = abilityIds.map(abilityId => (isAbilityId(abilityId) ? ABILITY_CONTENT[abilityId].code : null));

  if (!codes.every(code => code !== null)) return null;

  return codes;
};

/**
 * Gene mods placed in their body parts, which go from Brain to Legs, each at most once.
 *
 * @param geneModIds gene mod ids in body part order.
 * @returns gene mods by body part; null if an id is not a gene mod, or body parts repeat or go out of order.
 */
const geneModsByBodyPart = (geneModIds: readonly AbilityId[]) => {
  const geneMods: SelectedGeneMods = [...EMPTY_GENE_MODS];
  let lastBodyPartIndex = -1;

  for (const geneModId of geneModIds) {
    const bodyPartIndex = BODY_PART_INDEX_BY_GENE_MOD.get(geneModId) ?? null;

    if (bodyPartIndex === null || bodyPartIndex <= lastBodyPartIndex) return null;

    geneMods[bodyPartIndex] = geneModId;
    lastBodyPartIndex = bodyPartIndex;
  }

  return geneMods;
};

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
 * @returns the codes; null for a class of another kind, an unknown ability or a build that breaks a Build rule.
 */
export const mecBuildCodes = (build: Readonly<SoldierBuildData>): SoldierBuildCodes | null => {
  const soldierClass = buildClass(build, MEC_CLASS_BY_CODE);
  const perkIds = build.perks.slice(1);

  if (!soldierClass || !assembleSoldierBuild(soldierClass, perkIds, build.name)) return null;

  const perks = abilityCodes(perkIds);

  if (!perks) return null;

  return { classCode: soldierClass.code, perks, name: codeOfName(build.name, soldierClass.name) };
};

/**
 * MEC build of stable codes, assembled with the mutators by the Build rules.
 *
 * @param codes MEC build codes.
 * @returns the build; null for an unknown code, a class of another kind or a choice a Build rule refuses.
 */
export const mecBuildFromCodes = (codes: Readonly<SoldierBuildCodes>): SoldierBuildData | null => {
  const soldierClass = MEC_CLASS_BY_CODE.get(codes.classCode) ?? null;
  const perkIds = abilityIdsOfCodes(codes.perks);

  if (!soldierClass || !perkIds) return null;

  return assembleSoldierBuild(soldierClass, perkIds, nameOfCode(codes.name, soldierClass.name));
};

/**
 * Biosoldier build as stable codes.
 *
 * @param build biosoldier build.
 * @returns the codes; null for a class of another kind, an unknown ability or a build that breaks a Build rule.
 */
export const biosoldierBuildCodes = (build: Readonly<BiosoldierBuildData>): BiosoldierBuildCodes | null => {
  const soldierClass = buildClass(build, BIOSOLDIER_CLASS_BY_CODE);
  const selections: BiosoldierSelections = {
    perks: build.perks.slice(1),
    geneModsByBodyPart: build.geneMods,
    psionicAbilities: build.psionicAbilities,
    officerPerks: build.officerPerks,
  };

  if (!soldierClass || !assembleBiosoldierBuild(soldierClass, selections, build.name)) return null;

  const perks = abilityCodes(selections.perks);
  const geneMods = abilityCodes(build.geneMods.filter(geneModId => geneModId !== null));
  const psionicAbilities = abilityCodes(build.psionicAbilities);
  const officerPerks = abilityCodes(build.officerPerks);

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
 * Biosoldier build of stable codes, assembled with the mutators by the Build rules; each gene mod goes to its body part.
 *
 * @param codes biosoldier build codes.
 * @returns the build; null for an unknown code, a class of another kind, gene mods whose body parts repeat or go out of
 * order, or a choice a Build rule refuses.
 */
export const biosoldierBuildFromCodes = (codes: Readonly<BiosoldierBuildCodes>): BiosoldierBuildData | null => {
  const soldierClass = BIOSOLDIER_CLASS_BY_CODE.get(codes.classCode) ?? null;
  const perks = abilityIdsOfCodes(codes.perks);
  const geneModIds = abilityIdsOfCodes(codes.geneMods);
  const psionicAbilities = abilityIdsOfCodes(codes.psionicAbilities);
  const officerPerks = abilityIdsOfCodes(codes.officerPerks);

  if (!soldierClass || !perks || !geneModIds || !psionicAbilities || !officerPerks) return null;

  const geneMods = geneModsByBodyPart(geneModIds);

  if (!geneMods) return null;

  const selections: BiosoldierSelections = { perks, geneModsByBodyPart: geneMods, psionicAbilities, officerPerks };

  return assembleBiosoldierBuild(soldierClass, selections, nameOfCode(codes.name, soldierClass.name));
};
