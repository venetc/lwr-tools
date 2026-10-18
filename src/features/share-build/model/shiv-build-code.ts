import type { SelectedShivPerks, ShivBuildData } from '@entities/shiv';
import { isShivPerkId, SHIV_BUILD_NAME, SHIV_PERK_ID_BY_CODE, shivPerkById, TECHNOLOGY_LEVELS } from '@entities/shiv';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  INVALID_SHARE_CODE,
  NAME_LENGTH_BITS,
  SHARE_CODE_FORMAT,
  SHIV_BUILD_PARTS,
  SHIV_BUILD_SECTION,
  SHIV_PERK_CODE_BITS,
  SHIV_PERK_COUNT_BITS,
} from '../config/constants';
import type { ShareCodeDecodeResult } from './share-code';
import { decodeName, openShareCode } from './share-code';

/**
 * Optional part of a SHIV build code that decoding can skip; the perks are always read.
 */
export type ShivBuildPart = 'name';

/**
 * Selected perks of the `PERKS` section, each placed on its technology level of the current tree; null if a perk
 * number is unknown, two perks share a level, or the section is not read exactly to its end.
 *
 * @param reader section reader.
 */
const readPerks = (reader: BitReader): SelectedShivPerks | null => {
  const perkCount = reader.readUint(SHIV_PERK_COUNT_BITS);
  const perkIds = Array.from({ length: perkCount }, () => SHIV_PERK_ID_BY_CODE.get(reader.readUint(SHIV_PERK_CODE_BITS)));

  if (!reader.isComplete) return null;

  if (!perkIds.every(perkId => typeof perkId === 'string')) return null;

  const perks: SelectedShivPerks = TECHNOLOGY_LEVELS.map(() => null);

  const isPlaced = perkIds.every((perkId) => {
    const levelIndex = TECHNOLOGY_LEVELS.findIndex(level => level.perks.some(perk => perk.id === perkId));

    if (levelIndex === -1 || perks[levelIndex] !== null) return false;

    perks[levelIndex] = perkId;

    return true;
  });

  if (!isPlaced) return null;

  return perks;
};

/**
 * Share code of the SHIV build: the `PERKS` section with the selected perks, and the `NAME` section if the name
 * differs from the default one; null if the build has an unknown perk or a section outgrows its length limit.
 *
 * @param build SHIV build.
 */
export const encodeShivBuild = (build: ShivBuildData) => {
  const perkIds = build.perks.filter(perkId => perkId !== null);

  if (!perkIds.every(isShivPerkId)) return null;

  const sections: BinaryCodeSection[] = [{
    id: SHIV_BUILD_SECTION.PERKS,
    write: (writer) => {
      writer.writeUint(perkIds.length, SHIV_PERK_COUNT_BITS);
      perkIds.forEach(perkId => writer.writeUint(shivPerkById(perkId).code, SHIV_PERK_CODE_BITS));
    },
  }];

  if (build.name !== SHIV_BUILD_NAME) {
    sections.push({ id: SHIV_BUILD_SECTION.NAME, write: writer => writer.writeString(build.name, NAME_LENGTH_BITS) });
  }

  return encodeBinaryCode(SHARE_CODE_FORMAT.SHIV_BUILD, sections);
};

/**
 * SHIV build of the share code; `other-unit` for a build code of another unit; `invalid` if the code is broken,
 * has no valid `PERKS` section or has an invalid section of a requested part. Parts that are not requested or absent
 * get their defaults; unknown sections are skipped.
 *
 * @param code share code.
 * @param parts optional parts to read; all by default.
 */
export const decodeShivBuild = (code: string, parts = SHIV_BUILD_PARTS): ShareCodeDecodeResult<ShivBuildData> => {
  const shareCode = openShareCode(code, SHARE_CODE_FORMAT.SHIV_BUILD);

  if (shareCode.status !== 'opened') return shareCode;

  const perksReader = shareCode.sections.get(SHIV_BUILD_SECTION.PERKS);
  const perks = perksReader && readPerks(perksReader);

  if (!perks) return INVALID_SHARE_CODE;

  const nameReader = shareCode.sections.get(SHIV_BUILD_SECTION.NAME) ?? null;
  const name = decodeName(nameReader, SHIV_BUILD_NAME, parts.includes('name'));

  if (name === null) return INVALID_SHARE_CODE;

  return { status: 'decoded', build: { perks, name } };
};
