import type { BitReader, BitWriter } from '@shared/lib/bit-stream';

export interface BinaryCodeSection {
  /** Section id, from 1; unique within the code. */
  id: number
  /** Writes the section fields, at most 511 bits; a longer section fails the whole code. */
  write: (writer: BitWriter) => void
}

export interface OpenedBinaryCode {
  /** Format number from the code header. */
  format: number
  /** Readers of the section fields by section id. */
  sections: Map<number, BitReader>
}
