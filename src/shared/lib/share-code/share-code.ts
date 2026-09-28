import type { BitReader } from './bit-reader';
import { createBitReader } from './bit-reader';
import type { BitWriter } from './bit-writer';
import { createBitWriter } from './bit-writer';

const FORMAT_BITS = 8;

/** Width of a section id; part of the section layout, a change means new format numbers. */
const SECTION_ID_BITS = 5;

/** Width of a section length in bits; part of the section layout, a change means new format numbers. */
const SECTION_LENGTH_BITS = 9;

const END_SECTION_ID = 0;

const CRC_POLYNOMIAL = 0x07;

const BASE64URL_PATTERN = /^[\w-]+$/;

export interface ShareCodeSection {
  /** Section id, from 1; unique within the code. */
  id: number
  /** Writes the section fields, at most 511 bits. */
  write: (writer: BitWriter) => void
}

export interface OpenedShareCode {
  /** Format number from the code header. */
  format: number
  /** Readers of the section fields by section id. */
  sections: Map<number, BitReader>
}

/**
 * CRC-8 checksum of the bytes.
 *
 * @param bytes checked bytes.
 */
const crc8 = (bytes: Uint8Array) => {
  return bytes.reduce((crc, byte) => {
    let value = crc ^ byte;

    for (let bit = 0; bit < 8; bit++) {
      value = value & 0x80 ? ((value << 1) ^ CRC_POLYNOMIAL) & 0xFF : (value << 1) & 0xFF;
    }

    return value;
  }, 0);
};

/**
 * Bytes as base64url without padding.
 *
 * @param bytes encoded bytes.
 */
const toBase64Url = (bytes: Uint8Array) => {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
};

/**
 * Bytes of a base64url string without padding, or null if it is not valid base64url.
 *
 * @param text decoded string.
 */
const fromBase64Url = (text: string) => {
  if (!BASE64URL_PATTERN.test(text)) return null;

  try {
    const binary = atob(text.replaceAll('-', '+').replaceAll('_', '/'));

    return Uint8Array.from(binary, char => char.charCodeAt(0));
  } catch {
    return null;
  }
};

/**
 * Share code: format byte, sections by ascending id, each with its id and bit length, end id, CRC-8 byte,
 * all in base64url.
 *
 * @param format format number of the code.
 * @param sections code sections in any order.
 */
export const encodeShareCode = (format: number, sections: ShareCodeSection[]) => {
  const writer = createBitWriter();

  writer.writeUint(format, FORMAT_BITS);

  [...sections].sort((first, second) => first.id - second.id).forEach((section) => {
    const sectionWriter = createBitWriter();

    section.write(sectionWriter);
    writer.writeUint(section.id, SECTION_ID_BITS);
    writer.writeUint(sectionWriter.bitLength, SECTION_LENGTH_BITS);
    writer.append(sectionWriter);
  });

  writer.writeUint(END_SECTION_ID, SECTION_ID_BITS);

  const bytes = writer.toBytes();

  return toBase64Url(Uint8Array.of(...bytes, crc8(bytes)));
};

/**
 * Section readers by id, or null if ids are not ascending, a section or the end id runs past the data,
 * or whole bytes follow the end id.
 *
 * @param reader reader positioned at the first section.
 */
const readSections = (reader: BitReader) => {
  const sections = new Map<number, BitReader>();
  let previousId = END_SECTION_ID;
  let id = reader.readUint(SECTION_ID_BITS);

  while (id !== END_SECTION_ID) {
    if (id <= previousId) return null;

    sections.set(id, reader.readSection(reader.readUint(SECTION_LENGTH_BITS)));
    previousId = id;
    id = reader.readUint(SECTION_ID_BITS);
  }

  if (reader.isOverrun || reader.remainingBits >= 8) return null;

  return sections;
};

/**
 * Format and section readers of a share code, or null if the string is not a share code, its checksum fails
 * or its sections are malformed.
 *
 * @param code share code, surrounding whitespace allowed.
 */
export const openShareCode = (code: string): OpenedShareCode | null => {
  const bytes = fromBase64Url(code.trim());

  if (!bytes || bytes.length < 2) return null;

  const payload = bytes.subarray(0, -1);

  if (crc8(payload) !== bytes[bytes.length - 1]) return null;

  const sections = readSections(createBitReader(payload, FORMAT_BITS));

  if (!sections) return null;

  return { format: payload[0], sections };
};
