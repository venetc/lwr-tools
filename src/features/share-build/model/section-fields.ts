import type { BinaryCodeSection, BitReader, BitWriter } from '@shared/lib/binary-code';

import { NAME_LENGTH_BITS } from '../config/constants';

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
