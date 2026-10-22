import type { BitReader, BitWriter } from '@shared/lib/binary-code';

/**
 * Writes a counted code list: the number of codes, then each code.
 *
 * @param writer section writer.
 * @param codes codes in list order.
 * @param countBits width of the count.
 * @param codeBits width of each code.
 */
export const writeCodeList = (writer: BitWriter, codes: readonly number[], countBits: number, codeBits: number) => {
  writer.writeUint(codes.length, countBits);
  codes.forEach(code => writer.writeUint(code, codeBits));
};

/**
 * Reads a counted code list written by `writeCodeList`.
 *
 * @param reader section reader.
 * @param countBits width of the count.
 * @param codeBits width of each code.
 */
export const readCodeList = (reader: BitReader, countBits: number, codeBits: number) => {
  const count = reader.readUint(countBits);

  return Array.from({ length: count }, () => reader.readUint(codeBits));
};

/**
 * Fields of a section read in whole; null if the fields leave bits unread or run past the section end.
 *
 * @param reader section reader.
 * @param readFields reads the section fields.
 */
export const readWholeSection = <Fields>(reader: BitReader, readFields: (reader: BitReader) => Fields): Fields | null => {
  const fields = readFields(reader);

  if (!reader.isComplete) return null;

  return fields;
};
