import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import { INVALID_SHARE_CODE, NAME_LENGTH_BITS, SHARE_CODE_FORMAT_UNIT } from '../config/constants';
import { readWholeSection } from './section-fields';

/**
 * Why a share code could not be decoded: it is broken, or it carries a build of another unit.
 */
export type ShareCodeFailure = { status: 'invalid' } | { status: 'other-unit', unit: string };

/**
 * Result of decoding a share code: the decoded build, or why it failed.
 */
export type ShareCodeDecodeResult<Build> = { status: 'decoded', build: Build } | ShareCodeFailure;

/**
 * Share code opened for its expected format.
 */
export type OpenedShareCode = { status: 'opened', sections: Map<number, BitReader> } | ShareCodeFailure;

/**
 * Build code format: its number, the sections a build is written to and how the build is read back. Unit codes add
 * their own sections to the same format.
 */
export interface BuildCodeLayout<Build> {
  /** Share code format number. */
  format: number
  /** Id of the `LOADOUT` section a Unit code of the format adds to the build sections. */
  loadoutSection: number
  /** Sections of the build, by ascending id; null if the build has no codes. */
  writeBuild: (build: Build) => BinaryCodeSection[] | null
  /** Build of the code sections; unknown sections are skipped; null if a section is broken or the codes make no build. */
  readBuild: (sections: ReadonlyMap<number, BitReader>) => Build | null
}

/**
 * Section readers of a share code of the expected format; `other-unit` for a valid code of another known format,
 * `invalid` for anything else.
 *
 * @param code share code.
 * @param format expected format number.
 */
export const openShareCode = (code: string, format: number): OpenedShareCode => {
  const binaryCode = openBinaryCode(code);

  if (!binaryCode) return INVALID_SHARE_CODE;

  if (binaryCode.format === format) return { status: 'opened', sections: binaryCode.sections };

  const unit = SHARE_CODE_FORMAT_UNIT.get(binaryCode.format);

  if (!unit) return INVALID_SHARE_CODE;

  return { status: 'other-unit', unit };
};

/**
 * Section with the build name.
 *
 * @param id id of the `NAME` section of the format.
 * @param name build name.
 */
export const nameSection = (id: number, name: string): BinaryCodeSection => ({
  id,
  write: writer => writer.writeString(name, NAME_LENGTH_BITS),
});

/**
 * Build name of a `NAME` section read in whole.
 *
 * @param reader reader of the `NAME` section; null if the code has none.
 * @returns `{ name }` with the name, or with null without the section; null if the section is broken.
 */
export const readNameSection = (reader: BitReader | null): { name: string | null } | null => {
  if (!reader) return { name: null };

  return readWholeSection(reader, sectionReader => ({ name: sectionReader.readString(NAME_LENGTH_BITS) }));
};

/**
 * Share code encoder and decoder of builds of one format.
 *
 * @param layout sections of the format and how the build is read back.
 */
export const buildCodec = <Build>(layout: BuildCodeLayout<Build>) => {
  /**
   * Share code of the build: the sections of the layout in the frame of its format.
   *
   * @param build build of the format.
   * @returns the code; null if the build has no codes or a section outgrows its length limit.
   */
  const encode = (build: Build) => {
    const sections = layout.writeBuild(build);

    if (!sections) return null;

    return encodeBinaryCode(layout.format, sections);
  };

  /**
   * Build of the share code; `other-unit` for a build code of another unit. Unknown sections are skipped.
   *
   * @param code share code.
   * @returns the build; `invalid` if the code is broken or the layout reads no build of its sections.
   */
  const decode = (code: string): ShareCodeDecodeResult<Build> => {
    const shareCode = openShareCode(code, layout.format);

    if (shareCode.status !== 'opened') return shareCode;

    const build = layout.readBuild(shareCode.sections);

    if (!build) return INVALID_SHARE_CODE;

    return { status: 'decoded', build };
  };

  return { encode, decode };
};
