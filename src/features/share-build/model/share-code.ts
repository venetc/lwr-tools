import type { BitReader } from '@shared/lib/binary-code';
import { openBinaryCode } from '@shared/lib/binary-code';

import { INVALID_SHARE_CODE, SHARE_CODE_FORMAT_UNIT } from '../config/constants';

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

  const unit = SHARE_CODE_FORMAT_UNIT.get(binaryCode.format) ?? null;

  if (unit === null) return INVALID_SHARE_CODE;

  return { status: 'other-unit', unit };
};
