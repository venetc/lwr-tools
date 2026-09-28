import type { SoldierBuildData, SoldierClass } from '@entities/soldier';
import {
  abilityById,
  abilityIdByCode,
  isAbilityId,
  SOLDIER_RANKS,
  soldierBuildName,
  soldierClassBaseBuild,
  soldierClassByCode,
} from '@entities/soldier';
import type { BitReader, BitWriter, ShareCodeSection } from '@shared/lib/share-code';
import { encodeShareCode, openShareCode } from '@shared/lib/share-code';

import { SHARE_CODE_FORMAT } from '../config/share-code-format';
import { SOLDIER_BUILD_SECTION } from '../config/soldier-build-section';
import type { SoldierBuildPart } from './types';

/** Width of the class number; part of the `TALENTS` section, a change means a new section id. */
export const CLASS_CODE_BITS = 5;

/** Width of the selected talent count; part of the `TALENTS` section, a change means a new section id. */
const TALENT_COUNT_BITS = 3;

/** Width of the ability number; part of the `TALENTS` section, a change means a new section id. */
export const ABILITY_CODE_BITS = 8;

/** Width of the name byte length; part of the `NAME` section, a change means a new section id. */
const NAME_LENGTH_BITS = 5;

const SOLDIER_BUILD_PARTS: SoldierBuildPart[] = ['name'];

/**
 * Whether the section was read exactly to its end.
 *
 * @param reader section reader.
 */
const isSectionComplete = (reader: BitReader) => !reader.isOverrun && reader.remainingBits === 0;

/**
 * Ability numbers of the talents selected above the granted ones, or null if some talent is unknown.
 *
 * @param build soldier build.
 */
const selectedAbilityCodes = (build: SoldierBuildData) => {
  const selectedTalents = build.talents.slice(soldierClassBaseBuild(build.soldierClass).length);

  if (!selectedTalents.every(isAbilityId)) return null;

  return selectedTalents.map(abilityId => abilityById(abilityId).code);
};

/**
 * Writes the `TALENTS` section: class and numbers of the talents selected above the granted ones.
 *
 * @param writer section writer.
 * @param classCode class number.
 * @param abilityCodes selected ability numbers.
 */
const writeTalents = (writer: BitWriter, classCode: number, abilityCodes: number[]) => {
  writer.writeUint(classCode, CLASS_CODE_BITS);
  writer.writeUint(abilityCodes.length, TALENT_COUNT_BITS);
  abilityCodes.forEach(abilityCode => writer.writeUint(abilityCode, ABILITY_CODE_BITS));
};

/**
 * Class and talents of the `TALENTS` section, granted ones included; null if a class or ability number is unknown,
 * talents outnumber the ranks, or the section is not read exactly to its end.
 *
 * @param reader section reader.
 */
const readTalents = (reader: BitReader): Omit<SoldierBuildData, 'name'> | null => {
  const soldierClass = soldierClassByCode(reader.readUint(CLASS_CODE_BITS));
  const talentCount = reader.readUint(TALENT_COUNT_BITS);
  const selectedTalents = Array.from({ length: talentCount }, () => abilityIdByCode(reader.readUint(ABILITY_CODE_BITS)))
    .filter(abilityId => abilityId !== null);

  if (!soldierClass || !isSectionComplete(reader)) return null;

  if (selectedTalents.length !== talentCount) return null;

  const baseBuild = soldierClassBaseBuild(soldierClass);

  if (baseBuild.length + selectedTalents.length > SOLDIER_RANKS.length) return null;

  return { soldierClass, talents: [...baseBuild, ...selectedTalents] };
};

/**
 * Writes the `NAME` section.
 *
 * @param writer section writer.
 * @param name build name.
 */
const writeName = (writer: BitWriter, name: string) => writer.writeString(name, NAME_LENGTH_BITS);

/**
 * Name of the `NAME` section; null if the section is not read exactly to its end.
 *
 * @param reader section reader.
 */
const readName = (reader: BitReader) => {
  const name = reader.readString(NAME_LENGTH_BITS);

  if (!isSectionComplete(reader)) return null;

  return name;
};

/**
 * Build name from the `NAME` section; the class name if the name part is not requested or the section is absent,
 * null if the section is invalid.
 *
 * @param sections section readers by id.
 * @param soldierClass soldier class of the build.
 * @param parts optional parts to read.
 */
const decodeName = (sections: Map<number, BitReader>, soldierClass: SoldierClass, parts: SoldierBuildPart[]) => {
  const reader = sections.get(SOLDIER_BUILD_SECTION.NAME) ?? null;

  if (!reader || !parts.includes('name')) return soldierBuildName(soldierClass, '');

  const name = readName(reader);

  if (name === null) return null;

  return soldierBuildName(soldierClass, name);
};

/**
 * Share code of the soldier build: the `TALENTS` section, and the `NAME` section if the name differs from the class name;
 * null if the build has an unknown talent.
 *
 * @param build soldier build.
 */
export const encodeSoldierBuild = (build: SoldierBuildData) => {
  const abilityCodes = selectedAbilityCodes(build);

  if (!abilityCodes) return null;

  const sections: ShareCodeSection[] = [
    { id: SOLDIER_BUILD_SECTION.TALENTS, write: writer => writeTalents(writer, build.soldierClass.code, abilityCodes) },
  ];

  if (build.name !== soldierBuildName(build.soldierClass, '')) {
    sections.push({ id: SOLDIER_BUILD_SECTION.NAME, write: writer => writeName(writer, build.name) });
  }

  return encodeShareCode(SHARE_CODE_FORMAT.SOLDIER_BUILD, sections);
};

/**
 * Soldier build of the share code, or null if the code is invalid, not a soldier build, has no valid `TALENTS` section
 * or has an invalid section of a requested part. Parts that are not requested or absent get their defaults;
 * unknown sections are skipped.
 *
 * @param code share code.
 * @param parts optional parts to read; all by default.
 */
export const decodeSoldierBuild = (code: string, parts = SOLDIER_BUILD_PARTS): SoldierBuildData | null => {
  const shareCode = openShareCode(code);

  if (!shareCode || shareCode.format !== SHARE_CODE_FORMAT.SOLDIER_BUILD) return null;

  const talentsReader = shareCode.sections.get(SOLDIER_BUILD_SECTION.TALENTS) ?? null;
  const talents = talentsReader && readTalents(talentsReader);

  if (!talents) return null;

  const name = decodeName(shareCode.sections, talents.soldierClass, parts);

  if (name === null) return null;

  return { ...talents, name };
};
