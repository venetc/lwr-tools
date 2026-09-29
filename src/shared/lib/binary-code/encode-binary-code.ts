import { toBase64Url } from '@shared/lib/base64-url';
import { createBitWriter } from '@shared/lib/bit-stream';
import { crc8 } from '@shared/lib/crc8';

import type { BinaryCodeSection } from './binary-code';
import { END_SECTION_ID, FORMAT_BITS, MAX_SECTION_BITS, SECTION_ID_BITS, SECTION_LENGTH_BITS } from './constants';

/**
 * Binary code: format byte, sections by ascending id, each with its id and bit length, end id, CRC-8 byte,
 * all in base64url; null if a section is longer than its length field can hold.
 *
 * @param format format number of the code.
 * @param sections code sections in any order.
 */
export const encodeBinaryCode = (format: number, sections: BinaryCodeSection[]) => {
  const writer = createBitWriter();

  writer.writeUint(format, FORMAT_BITS);

  const sortedSections = [...sections].sort((first, second) => first.id - second.id);

  for (const section of sortedSections) {
    const sectionWriter = createBitWriter();

    section.write(sectionWriter);

    if (sectionWriter.bitLength > MAX_SECTION_BITS) return null;

    writer.writeUint(section.id, SECTION_ID_BITS);
    writer.writeUint(sectionWriter.bitLength, SECTION_LENGTH_BITS);
    writer.append(sectionWriter);
  }

  writer.writeUint(END_SECTION_ID, SECTION_ID_BITS);

  const bytes = writer.toBytes();

  return toBase64Url(Uint8Array.of(...bytes, crc8(bytes)));
};
