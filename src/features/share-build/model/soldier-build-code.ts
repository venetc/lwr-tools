import type { BiosoldierBuildCodes, BiosoldierBuildData, SoldierBuildCodes, SoldierBuildData } from '@entities/soldier';
import { biosoldierBuildCodes, biosoldierBuildFromCodes, mecBuildCodes, mecBuildFromCodes } from '@entities/soldier';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  ABILITY_CODE_BITS,
  CLASS_CODE_BITS,
  GENE_MOD_COUNT_BITS,
  INVALID_SHARE_CODE,
  OFFICER_PERK_COUNT_BITS,
  PERK_COUNT_BITS,
  PSIONIC_ABILITY_COUNT_BITS,
  SHARE_CODE_FORMAT,
  SOLDIER_BUILD_SECTION,
} from '../config/constants';
import { readCodeList, readWholeSection, writeCodeList } from './section-fields';
import type { ShareCodeDecodeResult } from './share-code';
import { nameSection, openShareCode, readNameSection } from './share-code';

/**
 * Parts a soldier format carries beyond the class, perks and name: their sections and how they are read.
 */
interface SoldierBuildExtension<Codes extends SoldierBuildCodes> {
  /** Sections of the extra parts the codes have, by ascending id. */
  write: (codes: Codes) => BinaryCodeSection[]
  /** Codes of the soldier build with the extra parts read from the code sections; null if a section is broken. */
  read: (codes: SoldierBuildCodes, sections: ReadonlyMap<number, BitReader>) => Codes | null
}

/**
 * Share code encoder and decoder of soldier builds of one format: the `PERKS` and `NAME` sections of every soldier,
 * plus the parts of the format extension, over the build codes of the entity.
 *
 * @param format share code format number.
 * @param buildCodes build codes of a build; null if it cannot be encoded.
 * @param buildFromCodes build of the codes; null if they make no build.
 * @param extension parts of the format beyond the soldier ones.
 */
const soldierBuildCodec = <Build, Codes extends SoldierBuildCodes>(
  format: number,
  buildCodes: (build: Build) => Codes | null,
  buildFromCodes: (codes: Codes) => Build | null,
  extension: SoldierBuildExtension<Codes>,
) => {
  /**
   * Share code of the build: the `PERKS` section with the class and perks, the `NAME` section if the build has its own
   * name, then the extension sections.
   *
   * @param build soldier build of the format.
   * @returns the code; null if the build has no codes or a section outgrows its length limit.
   */
  const encode = (build: Build) => {
    const codes = buildCodes(build);

    if (!codes) return null;

    const sections: BinaryCodeSection[] = [{
      id: SOLDIER_BUILD_SECTION.PERKS,
      write: (writer) => {
        writer.writeUint(codes.classCode, CLASS_CODE_BITS);
        writeCodeList(writer, codes.perks, PERK_COUNT_BITS, ABILITY_CODE_BITS);
      },
    }];

    if (codes.name !== null) sections.push(nameSection(SOLDIER_BUILD_SECTION.NAME, codes.name));

    sections.push(...extension.write(codes));

    return encodeBinaryCode(format, sections);
  };

  /**
   * Build of the share code; `other-unit` for a build code of another unit. Absent sections of the extra parts give
   * empty parts; unknown sections are skipped.
   *
   * @param code share code.
   * @returns the build; `invalid` if the code is broken, has no `PERKS` section, has a broken section, or its codes make
   * no build.
   */
  const decode = (code: string): ShareCodeDecodeResult<Build> => {
    const shareCode = openShareCode(code, format);

    if (shareCode.status !== 'opened') return shareCode;

    const perksReader = shareCode.sections.get(SOLDIER_BUILD_SECTION.PERKS) ?? null;
    const perks = perksReader && readWholeSection(perksReader, reader => ({
      classCode: reader.readUint(CLASS_CODE_BITS),
      perks: readCodeList(reader, PERK_COUNT_BITS, ABILITY_CODE_BITS),
    }));
    const nameField = readNameSection(shareCode.sections.get(SOLDIER_BUILD_SECTION.NAME) ?? null);

    if (!perks || !nameField) return INVALID_SHARE_CODE;

    const codes = extension.read({ ...perks, name: nameField.name }, shareCode.sections);
    const build = codes && buildFromCodes(codes);

    if (!build) return INVALID_SHARE_CODE;

    return { status: 'decoded', build };
  };

  return { encode, decode };
};

/**
 * Section of an ability code list; none for an empty list.
 *
 * @param id section id.
 * @param codes ability codes in list order.
 * @param countBits width of the count.
 */
const abilityListSections = (id: number, codes: readonly number[], countBits: number): BinaryCodeSection[] => {
  if (codes.length === 0) return [];

  return [{ id, write: writer => writeCodeList(writer, codes, countBits, ABILITY_CODE_BITS) }];
};

/**
 * Ability codes of a list section read in whole.
 *
 * @param sections code sections by id.
 * @param id section id.
 * @param countBits width of the count.
 * @returns the codes; an empty list without the section; null if the section is broken.
 */
const readAbilityListSection = (sections: ReadonlyMap<number, BitReader>, id: number, countBits: number) => {
  const reader = sections.get(id) ?? null;

  if (!reader) return [];

  return readWholeSection(reader, sectionReader => readCodeList(sectionReader, countBits, ABILITY_CODE_BITS));
};

/** Soldier format without extra parts: the codes are the soldier codes. */
const SOLDIER_BUILD_EXTENSION: SoldierBuildExtension<SoldierBuildCodes> = {
  write: () => [],
  read: codes => codes,
};

/**
 * Biosoldier format: the soldier codes with the gene mods in the `GENE_MODS` section, the psionic abilities in the
 * `PSIONIC` section and the officer perks in the `OFFICER` section, each written only when the build has some.
 */
const BIOSOLDIER_BUILD_EXTENSION: SoldierBuildExtension<BiosoldierBuildCodes> = {
  write: codes => [
    ...abilityListSections(SOLDIER_BUILD_SECTION.GENE_MODS, codes.geneMods, GENE_MOD_COUNT_BITS),
    ...abilityListSections(SOLDIER_BUILD_SECTION.PSIONIC, codes.psionicAbilities, PSIONIC_ABILITY_COUNT_BITS),
    ...abilityListSections(SOLDIER_BUILD_SECTION.OFFICER, codes.officerPerks, OFFICER_PERK_COUNT_BITS),
  ],
  read: (codes, sections) => {
    const geneMods = readAbilityListSection(sections, SOLDIER_BUILD_SECTION.GENE_MODS, GENE_MOD_COUNT_BITS);
    const psionicAbilities = readAbilityListSection(sections, SOLDIER_BUILD_SECTION.PSIONIC, PSIONIC_ABILITY_COUNT_BITS);
    const officerPerks = readAbilityListSection(sections, SOLDIER_BUILD_SECTION.OFFICER, OFFICER_PERK_COUNT_BITS);

    if (!geneMods || !psionicAbilities || !officerPerks) return null;

    return { ...codes, geneMods, psionicAbilities, officerPerks };
  },
};

/** Share code encoder and decoder of biosoldier builds: `soldierBuildCodec` bound to format 1 and the biosoldier codes with gene mods, psionic abilities and officer perks. */
export const { encode: encodeBiosoldierBuild, decode: decodeBiosoldierBuild } = soldierBuildCodec<BiosoldierBuildData, BiosoldierBuildCodes>(
  SHARE_CODE_FORMAT.BIOSOLDIER_BUILD,
  biosoldierBuildCodes,
  biosoldierBuildFromCodes,
  BIOSOLDIER_BUILD_EXTENSION,
);

/** Share code encoder and decoder of MEC builds: `soldierBuildCodec` bound to format 3 and the MEC codes. */
export const { encode: encodeMecBuild, decode: decodeMecBuild } = soldierBuildCodec<SoldierBuildData, SoldierBuildCodes>(
  SHARE_CODE_FORMAT.MEC_BUILD,
  mecBuildCodes,
  mecBuildFromCodes,
  SOLDIER_BUILD_EXTENSION,
);
