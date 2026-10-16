import type { BinaryCodeSection } from '@shared/lib/binary-code';
import { createBitWriter } from '@shared/lib/bit-stream/create-bit-writer';

/**
 * CRC-8 with polynomial 0x07, the checksum of binary codes.
 *
 * @param bytes checked bytes.
 */
const crc8 = (bytes: Uint8Array) => {
  return bytes.reduce((crc, byte) => {
    let value = crc ^ byte;

    for (let bit = 0; bit < 8; bit++) {
      value = value & 0x80 ? ((value << 1) ^ 0x07) & 0xFF : (value << 1) & 0xFF;
    }

    return value;
  }, 0);
};

/**
 * Binary code of raw bit fields with a correct checksum, for codes the encoder never writes.
 *
 * @param fields pairs of value and bit width, in order.
 */
export const rawBinaryCode = (fields: [value: number, bits: number][]) => {
  const writer = createBitWriter();

  fields.forEach(([value, bits]) => writer.writeUint(value, bits));

  const bytes = writer.toBytes();

  return btoa(String.fromCharCode(...bytes, crc8(bytes)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
};

export const FORMAT = 7;

export const FIRST_SECTION: BinaryCodeSection = { id: 3, write: writer => writer.writeUint(0b1011, 4) };

export const SECOND_SECTION: BinaryCodeSection = { id: 12, write: writer => writer.writeUint(0b01, 2) };

export const DUPLICATE_SECTION: BinaryCodeSection = { id: 3, write: writer => writer.writeUint(0b1, 1) };

export const CODE_WITH_WRONG_CHECKSUM = 'BwAA';

export const CODE_WITH_DESCENDING_IDS = rawBinaryCode([[7, 8], [12, 5], [0, 9], [3, 5], [0, 9], [0, 5]]);

export const CODE_WITH_SECTION_PAST_END = rawBinaryCode([[7, 8], [3, 5], [400, 9], [0, 5]]);

export const CODE_WITHOUT_END_ID = rawBinaryCode([[7, 8], [3, 5], [0, 9]]);

export const CODE_WITH_BYTE_AFTER_END_ID = rawBinaryCode([[7, 8], [0, 5], [0, 3], [0, 8]]);
