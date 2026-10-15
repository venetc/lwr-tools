import type { BiosoldierBuildData, SoldierBuildData, SoldierClass } from '@entities/soldier';
import { ABILITY_ID_BY_CODE, abilityById, BIOSOLDIER_CLASS_BY_CODE, EMPTY_GENE_MODS, isAbilityId, MEC_CLASS_BY_CODE, SOLDIER_RANKS } from '@entities/soldier';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';
import type { DeepReadonly } from '@shared/lib/object';

import {
  ABILITY_CODE_BITS,
  CLASS_CODE_BITS,
  INVALID_SHARE_CODE,
  NAME_LENGTH_BITS,
  PERK_COUNT_BITS,
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
 * Share code encoder and decoder of soldier builds of one format, bound to the classes of that format.
 *
 * @param format share code format number.
 * @param classByCode classes the format carries by their code; a build or code with any other class is rejected.
 */
export const soldierBuildCodec = (format: number, classByCode: ReadonlyMap<number, DeepReadonly<SoldierClass>>) => {
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
   * Share code of the soldier build: the `PERKS` section, and the `NAME` section if the name differs from the class name;
   * null if the build class is not of the format, the build has an unknown perk or a section outgrows its length limit.
   *
   * @param build soldier build.
   */
  const encode = (build: SoldierBuildData) => {
    if (!classByCode.has(build.soldierClass.code)) return null;

    const selectedPerks = build.perks.slice(1);

    if (!selectedPerks.every(isAbilityId)) return null;

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

    return encodeBinaryCode(format, sections);
  };

  /**
   * Soldier build of the share code; `other-unit` for a build code of another unit; `invalid` if the code is broken,
   * has no valid `PERKS` section or has an invalid section of a requested part. Parts that are not requested or absent
   * get their defaults; unknown sections are skipped.
   *
   * @param code share code.
   * @param parts optional parts to read; all by default.
   */
  const decode = (code: string, parts = SOLDIER_BUILD_PARTS): ShareCodeDecodeResult<SoldierBuildData> => {
    const shareCode = openShareCode(code, format);

    if (shareCode.status !== 'opened') return shareCode;

    const perksReader = shareCode.sections.get(SOLDIER_BUILD_SECTION.PERKS) ?? null;
    const perks = perksReader && readPerks(perksReader);

    if (!perks) return INVALID_SHARE_CODE;

    const nameReader = shareCode.sections.get(SOLDIER_BUILD_SECTION.NAME) ?? null;
    const name = decodeName(nameReader, perks.soldierClass.name, parts.includes('name'));

    if (name === null) return INVALID_SHARE_CODE;

    return { status: 'decoded', build: { ...perks, name } };
  };

  return { encode, decode };
};

/** Soldier build codec bound to format 1 and the biosoldier classes. */
const biosoldierCodec = soldierBuildCodec(SHARE_CODE_FORMAT.BIOSOLDIER_BUILD, BIOSOLDIER_CLASS_BY_CODE);

/**
 * Share code of the biosoldier build: its soldier build; gene mods are not carried yet.
 *
 * @param build biosoldier build.
 */
export const encodeBiosoldierBuild = (build: BiosoldierBuildData) => biosoldierCodec.encode(build);

/**
 * Biosoldier build of the share code: its soldier build without gene mods.
 *
 * @param code share code.
 * @param parts optional parts to read; all by default.
 */
export const decodeBiosoldierBuild = (code: string, parts = SOLDIER_BUILD_PARTS): ShareCodeDecodeResult<BiosoldierBuildData> => {
  const result = biosoldierCodec.decode(code, parts);

  if (result.status !== 'decoded') return result;

  return { status: 'decoded', build: { ...result.build, geneMods: [...EMPTY_GENE_MODS] } };
};

/** Share code encoder and decoder of MEC builds: `soldierBuildCodec` bound to format 3 and the MEC classes. */
export const { encode: encodeMecBuild, decode: decodeMecBuild } = soldierBuildCodec(
  SHARE_CODE_FORMAT.MEC_BUILD,
  MEC_CLASS_BY_CODE,
);
