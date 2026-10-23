import { openBinaryCode } from '@shared/lib/binary-code';

import { INVALID_SHARE_CODE, SHARE_CODE_FORMAT, SQUAD_CODE_SEPARATOR } from '../config/constants';
import type { DecodedSquad } from './squad-code';
import { readSquad } from './squad-code';
import type { DecodedUnit } from './unit-code';
import { readUnit } from './unit-code';

/**
 * Result of reading a share code: a Unit of a Build code (without a Loadout) or of a Unit code, a Squad of a Squad
 * code, or `invalid` for anything else.
 */
export type ShareCodeReadResult = { status: 'unit', unit: DecodedUnit } | { status: 'squad', squad: DecodedSquad } | { status: 'invalid' };

/**
 * Reads a share code of any kind, opening its frame once: the format of the first part tells a Squad code from a
 * Build code or a Unit code, and the unit type of a Unit from the formats of the build code layouts. Unknown sections
 * are skipped.
 *
 * @param code share code, surrounding whitespace allowed.
 * @returns the Unit or the Squad; `invalid` if a part is broken, the format is unknown, or a code of a single Unit has
 * more than one part.
 */
export const readShareCode = (code: string): ShareCodeReadResult => {
  const [header = '', ...parts] = code.trim().split(SQUAD_CODE_SEPARATOR);
  const binaryCode = openBinaryCode(header);

  if (!binaryCode) return INVALID_SHARE_CODE;

  if (binaryCode.format === SHARE_CODE_FORMAT.SQUAD) {
    const squad = readSquad(binaryCode.sections, parts.map(openBinaryCode));

    return squad ? { status: 'squad', squad } : INVALID_SHARE_CODE;
  }

  const unit = parts.length ? null : readUnit(binaryCode);

  if (!unit) return INVALID_SHARE_CODE;

  return { status: 'unit', unit };
};
