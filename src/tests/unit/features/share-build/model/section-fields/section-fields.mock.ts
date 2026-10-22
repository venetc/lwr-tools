import type { BitReader, BitWriter } from '@shared/lib/bit-stream';
import { createBitReader, createBitWriter } from '@shared/lib/bit-stream';

export const COUNT_BITS = 3;

export const CODE_BITS = 8;

export const NARROW_CODE_BITS = 6;

export const FULL_CODES = [1, 255, 128, 7, 0, 64, 2];

export const NARROW_CODES = [63, 1, 32];

export const FIELD_BITS = 4;

export const FIELD_VALUE = 9;

/**
 * Reader of everything the writer wrote, ending exactly at the last written bit.
 *
 * @param writer writer of the fields.
 */
export const readerOf = (writer: BitWriter): BitReader => createBitReader(writer.toBytes(), 0, writer.bitLength);

/**
 * Reader of one field of `FIELD_BITS` bits with `FIELD_VALUE`, followed by extra zero bits.
 *
 * @param extraBits number of zero bits written after the field.
 */
export const fieldReader = (extraBits = 0): BitReader => {
  const writer = createBitWriter();

  writer.writeUint(FIELD_VALUE, FIELD_BITS);
  writer.writeUint(0, extraBits);

  return readerOf(writer);
};

/**
 * Reads one field of `FIELD_BITS` bits.
 *
 * @param reader section reader.
 */
export const readField = (reader: BitReader) => reader.readUint(FIELD_BITS);

/**
 * Reads two fields of `FIELD_BITS` bits, one more than the section has.
 *
 * @param reader section reader.
 */
export const readTwoFields = (reader: BitReader) => [reader.readUint(FIELD_BITS), reader.readUint(FIELD_BITS)];
