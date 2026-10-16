import type { BiosoldierBuildData, SelectedGeneMods, SelectedPsionicAbilities, SoldierBuildData, SoldierClass } from '@entities/soldier';
import {
  ABILITY_ID_BY_CODE,
  abilityById,
  BIOSOLDIER_CLASS_BY_CODE,
  BODY_PART_INDEX_BY_GENE_MOD,
  EMPTY_GENE_MODS,
  isAbilityId,
  MEC_CLASS_BY_CODE,
  NEURAL_DAMPING_ID,
  PSI_LEVELS,
  SOLDIER_RANKS,
} from '@entities/soldier';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';
import type { DeepReadonly } from '@shared/lib/object';

import {
  ABILITY_CODE_BITS,
  BIOSOLDIER_BUILD_PARTS,
  CLASS_CODE_BITS,
  GENE_MOD_COUNT_BITS,
  INVALID_SHARE_CODE,
  NAME_LENGTH_BITS,
  PERK_COUNT_BITS,
  PSIONIC_ABILITY_COUNT_BITS,
  SHARE_CODE_FORMAT,
  SOLDIER_BUILD_PARTS,
  SOLDIER_BUILD_SECTION,
} from '../config/constants';
import type { ShareCodeDecodeResult } from './share-code';
import { decodeName, openShareCode } from './share-code';

/**
 * Optional part of a soldier build code that decoding can skip; the class and perks are always read.
 */
export type SoldierBuildPart = 'name';

/**
 * Optional part of a biosoldier build code that decoding can skip.
 */
export type BiosoldierBuildPart = SoldierBuildPart | 'geneMods' | 'psionicAbilities';

/**
 * Parts a soldier format carries beyond the class, perks and name: their sections and how they are read.
 */
export interface SoldierBuildExtension<Build extends SoldierBuildData, Part extends string> {
  /** Optional parts read from a code by default; `'name'` among them reads the name. */
  parts: readonly Part[]
  /** Sections of the extra parts the build has, by ascending id; null if they cannot be encoded. */
  write: (build: Build) => BinaryCodeSection[] | null
  /** Build of the decoded soldier build and the code sections; null if a section of a requested part is invalid. */
  read: (build: SoldierBuildData, sections: ReadonlyMap<number, BitReader>, parts: readonly Part[]) => Build | null
}

/**
 * Share code encoder and decoder of soldier builds of one format, bound to the classes of that format: the `PERKS` and
 * `NAME` sections of every soldier, plus the parts of the format extension.
 *
 * @param format share code format number.
 * @param classByCode classes the format carries by their code; a build or code with any other class is rejected.
 * @param extension parts of the format beyond the soldier ones.
 */
export const soldierBuildCodec = <Build extends SoldierBuildData, Part extends string>(
  format: number,
  classByCode: ReadonlyMap<number, DeepReadonly<SoldierClass>>,
  extension: SoldierBuildExtension<Build, Part>,
) => {
  /**
   * Class and perks of the `PERKS` section, the base perk included; null if a class is not of the format, an ability
   * number is unknown or not offered on its rank of the class tree, perks outnumber the ranks, or the section is not read
   * exactly to its end.
   *
   * @param reader section reader.
   */
  const readPerks = (reader: BitReader): Omit<SoldierBuildData, 'name'> | null => {
    const soldierClass = classByCode.get(reader.readUint(CLASS_CODE_BITS)) ?? null;
    const perkCount = reader.readUint(PERK_COUNT_BITS);
    const selectedPerks = Array.from({ length: perkCount }, () => ABILITY_ID_BY_CODE.get(reader.readUint(ABILITY_CODE_BITS)) ?? null)
      .filter(abilityId => abilityId !== null);

    if (!soldierClass || !reader.isComplete) return null;

    if (selectedPerks.length !== perkCount) return null;

    if (selectedPerks.length >= SOLDIER_RANKS.length) return null;

    const isInClassTree = selectedPerks.every((perkId, index) => soldierClass.perks[SOLDIER_RANKS[index + 1].id].includes(perkId));

    if (!isInClassTree) return null;

    return { soldierClass, perks: [soldierClass.basePerk, ...selectedPerks] };
  };

  /**
   * Share code of the build: the `PERKS` section, the `NAME` section if the name differs from the class name, then
   * the extension sections; null if the build class is not of the format, the build has an unknown perk, the extension
   * cannot be encoded or a section outgrows its length limit.
   *
   * @param build soldier build of the format.
   */
  const encode = (build: Build) => {
    if (!classByCode.has(build.soldierClass.code)) return null;

    const selectedPerks = build.perks.slice(1);

    if (!selectedPerks.every(isAbilityId)) return null;

    const extensionSections = extension.write(build);

    if (!extensionSections) return null;

    const sections: BinaryCodeSection[] = [{
      id: SOLDIER_BUILD_SECTION.PERKS,
      write: (writer) => {
        writer.writeUint(build.soldierClass.code, CLASS_CODE_BITS);
        writer.writeUint(selectedPerks.length, PERK_COUNT_BITS);
        selectedPerks.forEach(abilityId => writer.writeUint(abilityById(abilityId).code, ABILITY_CODE_BITS));
      },
    }];

    if (build.name !== build.soldierClass.name) {
      sections.push({ id: SOLDIER_BUILD_SECTION.NAME, write: writer => writer.writeString(build.name, NAME_LENGTH_BITS) });
    }

    sections.push(...extensionSections);

    return encodeBinaryCode(format, sections);
  };

  /**
   * Build of the share code; `other-unit` for a build code of another unit; `invalid` if the code is broken,
   * has no valid `PERKS` section or has an invalid section of a requested part. Parts that are not requested or absent
   * get their defaults; unknown sections are skipped.
   *
   * @param code share code.
   * @param parts optional parts to read; those of the extension by default.
   */
  const decode = (code: string, parts = extension.parts): ShareCodeDecodeResult<Build> => {
    const shareCode = openShareCode(code, format);

    if (shareCode.status !== 'opened') return shareCode;

    const perksReader = shareCode.sections.get(SOLDIER_BUILD_SECTION.PERKS) ?? null;
    const perks = perksReader && readPerks(perksReader);

    if (!perks) return INVALID_SHARE_CODE;

    const requestedParts: readonly string[] = parts;
    const isNameRequested = requestedParts.includes('name');
    const name = decodeName(shareCode.sections.get(SOLDIER_BUILD_SECTION.NAME) ?? null, perks.soldierClass.name, isNameRequested);

    if (name === null) return INVALID_SHARE_CODE;

    const build = extension.read({ ...perks, name }, shareCode.sections, parts);

    if (!build) return INVALID_SHARE_CODE;

    return { status: 'decoded', build };
  };

  return { encode, decode };
};

/** Soldier format without extra parts: the build is the soldier build. */
export const SOLDIER_BUILD_EXTENSION: SoldierBuildExtension<SoldierBuildData, SoldierBuildPart> = {
  parts: SOLDIER_BUILD_PARTS,
  write: () => [],
  read: build => build,
};

/**
 * `GENE_MODS` section of the gene mods, by body part; an empty list without gene mods; null if a gene mod is not of its
 * body part.
 *
 * @param build biosoldier build.
 */
const writeGeneMods = (build: BiosoldierBuildData): BinaryCodeSection[] | null => {
  const isEachInItsBodyPart = build.geneMods.every((geneModId, bodyPartIndex) => (
    geneModId === null || BODY_PART_INDEX_BY_GENE_MOD.get(geneModId) === bodyPartIndex
  ));

  if (!isEachInItsBodyPart) return null;

  const geneModIds = build.geneMods.filter(geneModId => geneModId !== null);

  if (geneModIds.length === 0) return [];

  return [{
    id: SOLDIER_BUILD_SECTION.GENE_MODS,
    write: (writer) => {
      writer.writeUint(geneModIds.length, GENE_MOD_COUNT_BITS);
      geneModIds.forEach(geneModId => writer.writeUint(abilityById(geneModId).code, ABILITY_CODE_BITS));
    },
  }];
};

/**
 * Gene mods of the `GENE_MODS` section by body part; null if a number is not a gene mod, body parts repeat or go out
 * of order, or the section is not read exactly to its end.
 *
 * @param reader section reader.
 */
const readGeneMods = (reader: BitReader): SelectedGeneMods | null => {
  const geneModCount = reader.readUint(GENE_MOD_COUNT_BITS);
  const geneModIds = Array.from({ length: geneModCount }, () => ABILITY_ID_BY_CODE.get(reader.readUint(ABILITY_CODE_BITS)) ?? null);

  if (!reader.isComplete) return null;

  const geneMods: SelectedGeneMods = [...EMPTY_GENE_MODS];
  let lastBodyPartIndex = -1;

  for (const geneModId of geneModIds) {
    const bodyPartIndex = geneModId === null ? null : BODY_PART_INDEX_BY_GENE_MOD.get(geneModId) ?? null;

    if (bodyPartIndex === null || bodyPartIndex <= lastBodyPartIndex) return null;

    geneMods[bodyPartIndex] = geneModId;
    lastBodyPartIndex = bodyPartIndex;
  }

  return geneMods;
};

/**
 * Whether each psionic ability is offered on its psi level, from Awakened, with no more abilities than psi levels.
 *
 * @param psionicAbilities psionic abilities by psi level.
 */
const isOnItsPsiLevels = (psionicAbilities: SelectedPsionicAbilities): boolean => (
  psionicAbilities.length <= PSI_LEVELS.length
  && psionicAbilities.every((abilityId, levelIndex) => PSI_LEVELS[levelIndex].abilities.includes(abilityId))
);

/**
 * `PSIONIC` section of the psionic abilities, by psi level; an empty list without psionic abilities; null if an ability
 * is not offered on its psi level, abilities outnumber the psi levels, or the build also has Neural Damping.
 *
 * @param build biosoldier build.
 */
const writePsionicAbilities = (build: BiosoldierBuildData): BinaryCodeSection[] | null => {
  if (build.psionicAbilities.length === 0) return [];

  if (!isOnItsPsiLevels(build.psionicAbilities)) return null;

  if (build.geneMods.includes(NEURAL_DAMPING_ID)) return null;

  return [{
    id: SOLDIER_BUILD_SECTION.PSIONIC,
    write: (writer) => {
      writer.writeUint(build.psionicAbilities.length, PSIONIC_ABILITY_COUNT_BITS);
      build.psionicAbilities.forEach(abilityId => writer.writeUint(abilityById(abilityId).code, ABILITY_CODE_BITS));
    },
  }];
};

/**
 * Psionic abilities of the `PSIONIC` section by psi level; null if an ability is not offered on its psi level,
 * abilities outnumber the psi levels, or the section is not read exactly to its end.
 *
 * @param reader section reader.
 */
const readPsionicAbilities = (reader: BitReader): SelectedPsionicAbilities | null => {
  const abilityCount = reader.readUint(PSIONIC_ABILITY_COUNT_BITS);
  const abilityIds = Array.from({ length: abilityCount }, () => ABILITY_ID_BY_CODE.get(reader.readUint(ABILITY_CODE_BITS)) ?? null);
  const psionicAbilities = abilityIds.filter(abilityId => abilityId !== null);

  if (!reader.isComplete) return null;

  if (psionicAbilities.length !== abilityCount) return null;

  if (!isOnItsPsiLevels(psionicAbilities)) return null;

  return psionicAbilities;
};

/**
 * Biosoldier format: the soldier build with its gene mods in the `GENE_MODS` section and its psionic abilities in the
 * `PSIONIC` section, each written only when the build has some.
 */
const BIOSOLDIER_BUILD_EXTENSION: SoldierBuildExtension<BiosoldierBuildData, BiosoldierBuildPart> = {
  parts: BIOSOLDIER_BUILD_PARTS,
  write: (build) => {
    const geneModSections = writeGeneMods(build);
    const psionicSections = writePsionicAbilities(build);

    if (!geneModSections || !psionicSections) return null;

    return [...geneModSections, ...psionicSections];
  },
  read: (build, sections, parts) => {
    const geneModsReader = parts.includes('geneMods') ? sections.get(SOLDIER_BUILD_SECTION.GENE_MODS) ?? null : null;
    const geneMods = geneModsReader ? readGeneMods(geneModsReader) : [...EMPTY_GENE_MODS];

    if (!geneMods) return null;

    const psionicReader = parts.includes('psionicAbilities') ? sections.get(SOLDIER_BUILD_SECTION.PSIONIC) ?? null : null;
    const psionicAbilities = psionicReader ? readPsionicAbilities(psionicReader) : [];

    if (!psionicAbilities) return null;

    if (geneMods.includes(NEURAL_DAMPING_ID) && psionicAbilities.length > 0) return null;

    return { ...build, geneMods, psionicAbilities };
  },
};

/** Share code encoder and decoder of biosoldier builds: `soldierBuildCodec` bound to format 1, the biosoldier classes, gene mods and psionic abilities. */
export const { encode: encodeBiosoldierBuild, decode: decodeBiosoldierBuild } = soldierBuildCodec(
  SHARE_CODE_FORMAT.BIOSOLDIER_BUILD,
  BIOSOLDIER_CLASS_BY_CODE,
  BIOSOLDIER_BUILD_EXTENSION,
);

/** Share code encoder and decoder of MEC builds: `soldierBuildCodec` bound to format 3 and the MEC classes. */
export const { encode: encodeMecBuild, decode: decodeMecBuild } = soldierBuildCodec(
  SHARE_CODE_FORMAT.MEC_BUILD,
  MEC_CLASS_BY_CODE,
  SOLDIER_BUILD_EXTENSION,
);
