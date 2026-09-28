const encoder = new TextEncoder();

export interface BitWriter {
  /** Writes the lowest `bits` bits of the value, most significant first. */
  writeUint: (value: number, bits: number) => void
  /** Writes the UTF-8 byte length in `lengthBits` bits and the bytes; a longer text is cut at a character boundary. */
  writeString: (text: string, lengthBits: number) => void
  /** Writes all bits written to another writer. */
  append: (writer: BitWriter) => void
  /** Written bits as bytes; the last byte is padded with zeros. */
  toBytes: () => Uint8Array
  /** Number of written bits. */
  readonly bitLength: number
}

/**
 * UTF-8 bytes of the text that fit the limit without cutting a character.
 *
 * @param text source text.
 * @param maxLength maximum byte count.
 */
const truncatedUtf8 = (text: string, maxLength: number) => {
  const bytes: number[] = [];

  for (const char of text) {
    const charBytes = encoder.encode(char);

    if (bytes.length + charBytes.length > maxLength) break;

    bytes.push(...charBytes);
  }

  return bytes;
};

/**
 * Writer of bit fields that are packed one after another.
 */
export const createBitWriter = (): BitWriter => {
  const bits: number[] = [];

  const writeUint = (value: number, bitCount: number) => {
    for (let shift = bitCount - 1; shift >= 0; shift--) {
      bits.push((value >> shift) & 1);
    }
  };

  const writeString = (text: string, lengthBits: number) => {
    const bytes = truncatedUtf8(text, 2 ** lengthBits - 1);

    writeUint(bytes.length, lengthBits);
    bytes.forEach(byte => writeUint(byte, 8));
  };

  const toBytes = () => {
    const bytes = new Uint8Array(Math.ceil(bits.length / 8));

    bits.forEach((bit, index) => {
      bytes[index >> 3] |= bit << (7 - (index & 7));
    });

    return bytes;
  };

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
