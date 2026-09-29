import type { BitWriter } from './bit-stream';
import { truncatedUtf8 } from './truncated-utf8';

/**
 * Writer of bit fields that are packed one after another.
 */
export const createBitWriter = (): BitWriter => {
  const bits: number[] = [];

  /**
   * Writes the lowest bits of the value, most significant first.
   *
   * @param value written number.
   * @param bitCount number of bits to write.
   */
  const writeUint = (value: number, bitCount: number) => {
    for (let shift = bitCount - 1; shift >= 0; shift--) {
      bits.push((value >> shift) & 1);
    }
  };

  /**
   * Writes the UTF-8 byte length and the bytes; a longer text is cut at a character boundary.
   *
   * @param text written text.
   * @param lengthBits width of the byte length.
   */
  const writeString = (text: string, lengthBits: number) => {
    const bytes = truncatedUtf8(text, 2 ** lengthBits - 1);

    writeUint(bytes.length, lengthBits);
    bytes.forEach(byte => writeUint(byte, 8));
  };

  /**
   * Written bits as bytes; the last byte is padded with zeros.
   *
   * @description Bit `index` goes to bit `7 - index % 8` of byte `index / 8`, counting from the least significant bit,
   * so each byte is filled from the most significant bit; unfilled low bits of the last byte stay 0.
   */
  const toBytes = () => {
    const bytes = new Uint8Array(Math.ceil(bits.length / 8));

    bits.forEach((bit, index) => {
      bytes[index >> 3] |= bit << (7 - (index & 7));
    });

    return bytes;
  };

  /**
   * Writes all bits written to another writer.
   *
   * @description The other writer is read through its bytes: bit `index` is bit `7 - index % 8` of byte `index / 8`.
   * Only `bitLength` bits are taken, so the zero padding of its last byte is not copied.
   *
   * @param writer writer whose bits are appended.
   */
  const append = (writer: BitWriter) => {
    const bytes = writer.toBytes();

    for (let index = 0; index < writer.bitLength; index++) {
      bits.push((bytes[index >> 3] >> (7 - (index & 7))) & 1);
    }
  };

  return {
    writeUint,
    writeString,
    append,
    toBytes,
    get bitLength() {
      return bits.length;
    },
  };
};
