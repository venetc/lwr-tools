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
  /** Whether the data was read exactly to its end, without going past it. */
  readonly isComplete: boolean
}

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
