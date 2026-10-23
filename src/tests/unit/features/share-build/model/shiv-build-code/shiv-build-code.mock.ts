import type { ShivBuildCodes, ShivBuildData } from '@entities/shiv';
import type { BinaryCodeSection } from '@shared/lib/binary-code';

export const BUILD_STUB: ShivBuildData = { perks: ['right', null, 'top'], name: 'SHIV' };

export const DEFAULT_NAME_CODES: ShivBuildCodes = { perks: [2, 5], name: null };

export const BUILD_NAME = 'Tank';

export const NAMED_CODES: ShivBuildCodes = { perks: [1, 4], name: BUILD_NAME };

export const SHIV_FORMAT = 2;

export const PERKS_SECTION_ID = 1;

export const NAME_SECTION_ID = 2;

export const UNKNOWN_SECTION_ID = 20;

export const INVALID_RESULT = { status: 'invalid' };

export const DECODED_RESULT = { status: 'unit', unit: { kind: 'shiv', build: BUILD_STUB, loadout: null } };

export const GARBAGE_CODE = 'not a code';

/**
 * SHIV `PERKS` section with raw numbers: perk count 3 bits, perk numbers 6 bits each.
 *
 * @param perkCodes selected perk numbers, in any order.
 * @param extraBits zero bits written after the fields.
 */
export const perksSection = (perkCodes: number[], extraBits = 0): BinaryCodeSection => ({
  id: PERKS_SECTION_ID,
  write: (writer) => {
    writer.writeUint(perkCodes.length, 3);
    perkCodes.forEach(perkCode => writer.writeUint(perkCode, 6));
    writer.writeUint(0, extraBits);
  },
});

/**
 * `NAME` section: UTF-8 byte length 5 bits, then the bytes.
 *
 * @param name build name.
 */
export const nameSection = (name: string): BinaryCodeSection => ({
  id: NAME_SECTION_ID,
  write: writer => writer.writeString(name, 5),
});

export const BROKEN_NAME_SECTION: BinaryCodeSection = { id: NAME_SECTION_ID, write: writer => writer.writeUint(31, 5) };

export const UNKNOWN_SECTION: BinaryCodeSection = { id: UNKNOWN_SECTION_ID, write: writer => writer.writeUint(0b11, 2) };
