import type { BinaryCodeSection } from '@shared/lib/binary-code';

export const FORMAT = 7;

export const FIRST_SECTION: BinaryCodeSection = { id: 3, write: writer => writer.writeUint(0b1011, 4) };

export const SECOND_SECTION: BinaryCodeSection = { id: 12, write: writer => writer.writeUint(0b01, 2) };

/**
 * Section of zero bits.
 *
 * @param bitCount section length in bits.
 */
const zeroSection = (bitCount: number): BinaryCodeSection => ({
  id: 5,
  write: (writer) => {
    for (let bit = 0; bit < bitCount; bit++) writer.writeUint(0, 1);
  },
});

export const LONGEST_SECTION = zeroSection(511);

export const TOO_LONG_SECTION = zeroSection(512);
