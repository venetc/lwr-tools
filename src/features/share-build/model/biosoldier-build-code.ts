import type { BiosoldierBuildData, BiosoldierClass } from '@entities/biosoldier';
import {
  ABILITY_ID_BY_CODE,
  abilityById,
  BIOSOLDIER_CLASS_BY_CODE,
  isAbilityId,
  SOLDIER_RANKS,
} from '@entities/biosoldier';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  ABILITY_CODE_BITS,
  BIOSOLDIER_BUILD_PARTS,
  BIOSOLDIER_BUILD_SECTION,
  CLASS_CODE_BITS,
  NAME_LENGTH_BITS,
  SHARE_CODE_FORMAT,
  TALENT_COUNT_BITS,
} from '../config/constants';

/**
 * Optional part of a biosoldier build code that decoding can skip; the class and talents are always read.
 */
export type BiosoldierBuildPart = 'name';

/**
 * Class and talents of the `TALENTS` section, granted ones included; null if a class or ability number is unknown,
 * talents outnumber the ranks, or the section is not read exactly to its end.
 *
 * @param reader section reader.
 */
const readTalents = (reader: BitReader): Omit<BiosoldierBuildData, 'name'> | null => {
  const biosoldierClass = BIOSOLDIER_CLASS_BY_CODE.get(reader.readUint(CLASS_CODE_BITS)) ?? null;
  const talentCount = reader.readUint(TALENT_COUNT_BITS);
  const selectedTalents = Array.from({ length: talentCount }, () => ABILITY_ID_BY_CODE.get(reader.readUint(ABILITY_CODE_BITS)) ?? null)
    .filter(abilityId => abilityId !== null);

  if (!biosoldierClass || !reader.isComplete) return null;

  if (selectedTalents.length !== talentCount) return null;

  if (biosoldierClass.baseBuild.length + selectedTalents.length > SOLDIER_RANKS.length) return null;

  return { biosoldierClass, talents: [...biosoldierClass.baseBuild, ...selectedTalents] };
};

/**
 * Build name from the `NAME` section; the class name if the name part is not requested or the section is absent,
 * null if the section is invalid.
 *
 * @param sections section readers by id.
 * @param biosoldierClass biosoldier class of the build.
 * @param parts optional parts to read.
 */
const decodeName = (sections: Map<number, BitReader>, biosoldierClass: BiosoldierClass, parts: readonly BiosoldierBuildPart[]) => {
  const reader = sections.get(BIOSOLDIER_BUILD_SECTION.NAME) ?? null;

  if (!reader || !parts.includes('name')) return biosoldierClass.name;

  const name = reader.readString(NAME_LENGTH_BITS);

  if (!reader.isComplete) return null;

  if (name.trim() === '') return biosoldierClass.name;

  return name;
};

/**
 * Share code of the biosoldier build: the `TALENTS` section, and the `NAME` section if the name differs from the class name;
 * null if the build has an unknown talent or a section outgrows its length limit.
 *
 * @param build biosoldier build.
 */
export const encodeBiosoldierBuild = (build: BiosoldierBuildData) => {
  const selectedTalents = build.talents.slice(build.biosoldierClass.baseBuild.length);

  if (!selectedTalents.every(isAbilityId)) return null;

  const sections: BinaryCodeSection[] = [{
    id: BIOSOLDIER_BUILD_SECTION.TALENTS,
    write: (writer) => {
      writer.writeUint(build.biosoldierClass.code, CLASS_CODE_BITS);
      writer.writeUint(selectedTalents.length, TALENT_COUNT_BITS);
      selectedTalents.forEach(abilityId => writer.writeUint(abilityById(abilityId).code, ABILITY_CODE_BITS));
    },
  }];

  if (build.name !== build.biosoldierClass.name) {
    sections.push({ id: BIOSOLDIER_BUILD_SECTION.NAME, write: writer => writer.writeString(build.name, NAME_LENGTH_BITS) });
  }

  return encodeBinaryCode(SHARE_CODE_FORMAT.BIOSOLDIER_BUILD, sections);
};

/**
 * Biosoldier build of the share code, or null if the code is invalid, not a biosoldier build, has no valid `TALENTS` section
 * or has an invalid section of a requested part. Parts that are not requested or absent get their defaults;
 * unknown sections are skipped.
 *
 * @param code share code.
 * @param parts optional parts to read; all by default.
 */
export const decodeBiosoldierBuild = (code: string, parts = BIOSOLDIER_BUILD_PARTS): BiosoldierBuildData | null => {
  const binaryCode = openBinaryCode(code);

  if (!binaryCode || binaryCode.format !== SHARE_CODE_FORMAT.BIOSOLDIER_BUILD) return null;

  const talentsReader = binaryCode.sections.get(BIOSOLDIER_BUILD_SECTION.TALENTS) ?? null;
  const talents = talentsReader && readTalents(talentsReader);

  if (!talents) return null;

  const name = decodeName(binaryCode.sections, talents.biosoldierClass, parts);

  if (name === null) return null;

  return { ...talents, name };
};
