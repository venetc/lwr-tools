import { fromBase64Url } from '@shared/lib/base64-url';
import { createBitReader } from '@shared/lib/bit-stream';
import { crc8 } from '@shared/lib/crc8';

import type { OpenedBinaryCode } from './binary-code';
import { FORMAT_BITS } from './constants';
import { readSections } from './read-sections';

/**
 * Format and section readers of a binary code, or null if the string is not a binary code, its checksum fails
 * or its sections are malformed.
 *
 * @description Layout after base64url decoding: the last byte is the CRC-8 of all bytes before it (the payload);
 * the payload starts with the format number, followed by the sections. At least the format and the CRC bytes
 * are required.
 *
 * @param code binary code, surrounding whitespace allowed.
 */
export const openBinaryCode = (code: string): OpenedBinaryCode | null => {
  const bytes = fromBase64Url(code.trim());

  if (!bytes || bytes.length < 2) return null;

  const payload = bytes.subarray(0, -1);

  if (crc8(payload) !== bytes[bytes.length - 1]) return null;

  const reader = createBitReader(payload);
  const format = reader.readUint(FORMAT_BITS);
  const sections = readSections(reader);

  if (!sections) return null;

  return { format, sections };
};
