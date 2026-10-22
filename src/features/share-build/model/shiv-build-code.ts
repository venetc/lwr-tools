import type { ShivBuildData } from '@entities/shiv';
import { shivBuildCodes, shivBuildFromCodes } from '@entities/shiv';
import type { BinaryCodeSection } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import { INVALID_SHARE_CODE, SHARE_CODE_FORMAT, SHIV_BUILD_SECTION, SHIV_PERK_CODE_BITS, SHIV_PERK_COUNT_BITS } from '../config/constants';
import { readCodeList, readWholeSection, writeCodeList } from './section-fields';
import type { ShareCodeDecodeResult } from './share-code';
import { nameSection, openShareCode, readNameSection } from './share-code';

/**
 * Share code of the SHIV build: the `PERKS` section with the selected perks, and the `NAME` section if the build has its
 * own name.
 *
 * @param build SHIV build.
 * @returns the code; null if the build has no codes or a section outgrows its length limit.
 */
export const encodeShivBuild = (build: ShivBuildData) => {
  const codes = shivBuildCodes(build);

  if (!codes) return null;

  const sections: BinaryCodeSection[] = [{
    id: SHIV_BUILD_SECTION.PERKS,
    write: writer => writeCodeList(writer, codes.perks, SHIV_PERK_COUNT_BITS, SHIV_PERK_CODE_BITS),
  }];

  if (codes.name !== null) sections.push(nameSection(SHIV_BUILD_SECTION.NAME, codes.name));

  return encodeBinaryCode(SHARE_CODE_FORMAT.SHIV_BUILD, sections);
};

/**
 * SHIV build of the share code; `other-unit` for a build code of another unit. Unknown sections are skipped.
 *
 * @param code share code.
 * @returns the build; `invalid` if the code is broken, has no `PERKS` section, has a broken section, or its codes make
 * no build.
 */
export const decodeShivBuild = (code: string): ShareCodeDecodeResult<ShivBuildData> => {
  const shareCode = openShareCode(code, SHARE_CODE_FORMAT.SHIV_BUILD);

  if (shareCode.status !== 'opened') return shareCode;

  const perksReader = shareCode.sections.get(SHIV_BUILD_SECTION.PERKS) ?? null;
  const perks = perksReader && readWholeSection(perksReader, reader => readCodeList(reader, SHIV_PERK_COUNT_BITS, SHIV_PERK_CODE_BITS));
  const nameField = readNameSection(shareCode.sections.get(SHIV_BUILD_SECTION.NAME) ?? null);

  if (!perks || !nameField) return INVALID_SHARE_CODE;

  const build = shivBuildFromCodes({ perks, name: nameField.name });

  if (!build) return INVALID_SHARE_CODE;

  return { status: 'decoded', build };
};
