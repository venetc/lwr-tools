const decoder = new TextDecoder();

export interface BitReader {
  /** Reads an unsigned number of `bits` bits, most significant first; 0 past the end. */
  readUint: (bits: number) => number
  /** Reads a UTF-8 string prefixed by its byte length of `lengthBits` bits; empty past the end. */
  readString: (lengthBits: number) => string
  /** Reader of the next `bitCount` bits, which this reader skips; empty past the end. */
  readSection: (bitCount: number) => BitReader
  /** Whether some read went past the end of the data. */
  readonly isOverrun: boolean
  /** Number of bits left after the current position. */
  readonly remainingBits: number
}

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

  const readUint = (bitCount: number) => {
    const start = position;

    if (!advance(bitCount)) return 0;

    let value = 0;

    for (let index = start; index < position; index++) {
      value = (value << 1) | ((bytes[index >> 3] >> (7 - (index & 7))) & 1);
    }

    return value;
  };

  const readString = (lengthBits: number) => {
    const length = readUint(lengthBits);
    const stringBytes = Uint8Array.from({ length }, () => readUint(8));

    if (isOverrun) return '';

    return decoder.decode(stringBytes);
  };

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
  };
};
