import type { BiosoldierBuildData, BiosoldierClass } from '@entities/biosoldier';
import {
  ABILITY_ID_BY_CODE,
  abilityById,
  BIOSOLDIER_CLASS_BY_CODE,
  isAbilityId,
  SOLDIER_RANKS,
} from '@entities/biosoldier';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  ABILITY_CODE_BITS,
  BIOSOLDIER_BUILD_PARTS,
  BIOSOLDIER_BUILD_SECTION,
  CLASS_CODE_BITS,
  INVALID_SHARE_CODE,
  NAME_LENGTH_BITS,
  PERK_COUNT_BITS,
  SHARE_CODE_FORMAT,
} from '../config/constants';
import type { ShareCodeDecodeResult } from './share-code';
import { openShareCode } from './share-code';

/**
 * Optional part of a biosoldier build code that decoding can skip; the class and perks are always read.
 */
export type BiosoldierBuildPart = 'name';

/**
 * Class and perks of the `PERKS` section, the base perk included; null if a class or ability number is unknown,
 * perks outnumber the ranks, or the section is not read exactly to its end.
 *
 * @param reader section reader.
 */
const readPerks = (reader: BitReader): Omit<BiosoldierBuildData, 'name'> | null => {
  const biosoldierClass = BIOSOLDIER_CLASS_BY_CODE.get(reader.readUint(CLASS_CODE_BITS)) ?? null;
  const perkCount = reader.readUint(PERK_COUNT_BITS);
  const selectedPerks = Array.from({ length: perkCount }, () => ABILITY_ID_BY_CODE.get(reader.readUint(ABILITY_CODE_BITS)) ?? null)
    .filter(abilityId => abilityId !== null);

  if (!biosoldierClass || !reader.isComplete) return null;

  if (selectedPerks.length !== perkCount) return null;

  if (selectedPerks.length >= SOLDIER_RANKS.length) return null;

  return { biosoldierClass, perks: [biosoldierClass.basePerk, ...selectedPerks] };
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
 * Share code of the biosoldier build: the `PERKS` section, and the `NAME` section if the name differs from the class name;
 * null if the build has an unknown perk or a section outgrows its length limit.
 *
 * @param build biosoldier build.
 */
export const encodeBiosoldierBuild = (build: BiosoldierBuildData) => {
  const selectedPerks = build.perks.slice(1);

  if (!selectedPerks.every(isAbilityId)) return null;

  const sections: BinaryCodeSection[] = [{
    id: BIOSOLDIER_BUILD_SECTION.PERKS,
    write: (writer) => {
      writer.writeUint(build.biosoldierClass.code, CLASS_CODE_BITS);
      writer.writeUint(selectedPerks.length, PERK_COUNT_BITS);
      selectedPerks.forEach(abilityId => writer.writeUint(abilityById(abilityId).code, ABILITY_CODE_BITS));
    },
  }];

  if (build.name !== build.biosoldierClass.name) {
    sections.push({ id: BIOSOLDIER_BUILD_SECTION.NAME, write: writer => writer.writeString(build.name, NAME_LENGTH_BITS) });
  }

  return encodeBinaryCode(SHARE_CODE_FORMAT.BIOSOLDIER_BUILD, sections);
};

/**
 * Biosoldier build of the share code; `other-unit` for a build code of another unit; `invalid` if the code is broken,
 * has no valid `PERKS` section or has an invalid section of a requested part. Parts that are not requested or absent
 * get their defaults; unknown sections are skipped.
 *
 * @param code share code.
 * @param parts optional parts to read; all by default.
 */
export const decodeBiosoldierBuild = (
  code: string,
  parts = BIOSOLDIER_BUILD_PARTS,
): ShareCodeDecodeResult<BiosoldierBuildData> => {
  const shareCode = openShareCode(code, SHARE_CODE_FORMAT.BIOSOLDIER_BUILD);

  if (shareCode.status !== 'opened') return shareCode;

  const perksReader = shareCode.sections.get(BIOSOLDIER_BUILD_SECTION.PERKS) ?? null;
  const perks = perksReader && readPerks(perksReader);

  if (!perks) return INVALID_SHARE_CODE;

  const name = decodeName(shareCode.sections, perks.biosoldierClass, parts);

  if (name === null) return INVALID_SHARE_CODE;

  return { status: 'decoded', build: { ...perks, name } };
};
