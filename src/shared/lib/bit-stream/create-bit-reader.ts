import type { BitReader } from './bit-stream';

/**
 * Reader of bit fields that are packed one after another; reading past the end sets `isOverrun` instead of failing.
 *
 * @param bytes data to read.
 * @param bitStart position of the first bit to read.
 * @param bitEnd position right after the last bit to read.
 */
export const createBitReader = (bytes: Uint8Array, bitStart = 0, bitEnd = bytes.length * 8): BitReader => {
  let position = bitStart;
  let isOverrun = false;

  /**
   * Moves the position by `bitCount` bits; false and the position at the end if the data is shorter.
   *
   * @param bitCount number of bits to move by.
   */
  const advance = (bitCount: number) => {
    if (position + bitCount <= bitEnd) {
      position += bitCount;

      return true;
    }

    isOverrun = true;
    position = bitEnd;

    return false;
  };

  /**
   * Unsigned number of the next bits, most significant first; 0 if the data is shorter.
   *
   * @description Bit `index` of the data is bit `7 - index % 8` of byte `index / 8`, counting from the least
   * significant bit, so bits go from the most significant within each byte. Each read bit is shifted into the value
   * from the right.
   *
   * @param bitCount number of bits to read.
   */
  const readUint = (bitCount: number) => {
    const start = position;

    if (!advance(bitCount)) return 0;

    let value = 0;

    for (let index = start; index < position; index++) {
      value = (value << 1) | ((bytes[index >> 3] >> (7 - (index & 7))) & 1);
    }

    return value;
  };

  /**
   * UTF-8 string prefixed by its byte length; empty if the data is shorter.
   *
   * @param lengthBits width of the byte length.
   */
  const readString = (lengthBits: number) => {
    const length = readUint(lengthBits);
    const stringBytes = Uint8Array.from({ length }, () => readUint(8));

    if (isOverrun) return '';

    return new TextDecoder().decode(stringBytes);
  };

  /**
   * Reader of the next bits, which this reader skips; an empty reader if the data is shorter.
   *
   * @param bitCount number of bits in the section.
   */
  const readSection = (bitCount: number) => {
    const start = position;

    if (!advance(bitCount)) return createBitReader(bytes, bitEnd, bitEnd);

    return createBitReader(bytes, start, position);
  };

  return {
    readUint,
    readString,
    readSection,
    get isOverrun() {
      return isOverrun;
    },
    get remainingBits() {
      return bitEnd - position;
    },
    get isComplete() {
      return !isOverrun && position === bitEnd;
    },
  };
};
