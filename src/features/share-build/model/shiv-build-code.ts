import type { ShivBuildData } from '@entities/shiv';
import { shivBuildCodes, shivBuildFromCodes } from '@entities/shiv';
import type { BinaryCodeSection } from '@shared/lib/binary-code';

import { SHARE_CODE_FORMAT, SHIV_BUILD_SECTION, SHIV_PERK_CODE_BITS, SHIV_PERK_COUNT_BITS } from '../config/constants';
import { readCodeList, readWholeSection, writeCodeList } from './section-fields';
import type { BuildCodeLayout } from './share-code';
import { buildCodec, nameSection, readNameSection } from './share-code';

/**
 * Layout of SHIV build codes: format 2 with the `PERKS` section of the selected perks and the `NAME` section if the
 * build has its own name; unknown sections are skipped. A code without the `PERKS` section, with a broken section or
 * with codes that make no build reads no build.
 */
export const SHIV_BUILD_LAYOUT: BuildCodeLayout<ShivBuildData> = {
  format: SHARE_CODE_FORMAT.SHIV_BUILD,
  loadoutSection: SHIV_BUILD_SECTION.LOADOUT,
  writeBuild: (build) => {
    const codes = shivBuildCodes(build);

    if (!codes) return null;

    const sections: BinaryCodeSection[] = [{
      id: SHIV_BUILD_SECTION.PERKS,
      write: writer => writeCodeList(writer, codes.perks, SHIV_PERK_COUNT_BITS, SHIV_PERK_CODE_BITS),
    }];

    if (codes.name !== null) sections.push(nameSection(SHIV_BUILD_SECTION.NAME, codes.name));

    return sections;
  },
  readBuild: (sections) => {
    const perksReader = sections.get(SHIV_BUILD_SECTION.PERKS) ?? null;
    const perks = perksReader && readWholeSection(perksReader, reader => readCodeList(reader, SHIV_PERK_COUNT_BITS, SHIV_PERK_CODE_BITS));
    const nameField = readNameSection(sections.get(SHIV_BUILD_SECTION.NAME) ?? null);

    if (!perks || !nameField) return null;

    return shivBuildFromCodes({ perks, name: nameField.name });
  },
};

/** Share code encoder and decoder of SHIV builds. */
export const { encode: encodeShivBuild, decode: decodeShivBuild } = buildCodec(SHIV_BUILD_LAYOUT);
