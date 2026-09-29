import { describe, expect, it } from 'vitest';

import { createBitReader } from '@shared/lib/bit-stream/create-bit-reader';

import { PACKED_BYTES, UTF8_STRING_BYTES } from './create-bit-reader.mock';

describe('createBitReader', () => {
  it('reads a number across a byte boundary', () => {
    const reader = createBitReader(PACKED_BYTES);
    reader.readUint(4);

    const value = reader.readUint(8);

    expect(value).toBe(0b00110101);
  });

  it('reads 0 past the end', () => {
    const reader = createBitReader(PACKED_BYTES);

    const value = reader.readUint(17);

    expect(value).toBe(0);
  });

  it('marks a read past the end as overrun', () => {
    const reader = createBitReader(PACKED_BYTES);

    reader.readUint(17);

    expect(reader.isOverrun).toBe(true);
  });

  it('counts the bits left', () => {
    const reader = createBitReader(PACKED_BYTES);

    reader.readUint(5);

    expect(reader.remainingBits).toBe(11);
  });

  it('marks a read exactly to the end as complete', () => {
    const reader = createBitReader(PACKED_BYTES);

    reader.readUint(16);

    expect(reader.isComplete).toBe(true);
  });

  it('does not mark a read with bits left as complete', () => {
    const reader = createBitReader(PACKED_BYTES);

    reader.readUint(15);

    expect(reader.isComplete).toBe(false);
  });

  it('does not mark a read past the end as complete', () => {
    const reader = createBitReader(PACKED_BYTES);

    reader.readUint(17);

    expect(reader.isComplete).toBe(false);
  });

  it('reads only the given bit range', () => {
    const reader = createBitReader(PACKED_BYTES, 4, 12);

    const value = reader.readUint(8);

    expect(value).toBe(0b00110101);
  });

  it('reads a UTF-8 string after its byte length', () => {
    const reader = createBitReader(UTF8_STRING_BYTES);

    const text = reader.readString(3);

    expect(text).toBe('BiS');
  });

  it('gives a section reader over the next bits', () => {
    const reader = createBitReader(PACKED_BYTES);
    reader.readUint(4);

    const section = reader.readSection(8);

    expect(section.readUint(8)).toBe(0b00110101);
  });

  it('skips the section bits in the parent reader', () => {
    const reader = createBitReader(PACKED_BYTES);
    reader.readUint(4);

    reader.readSection(8);

    expect(reader.readUint(4)).toBe(0b1100);
  });

  it('keeps the section reader within the section', () => {
    const reader = createBitReader(PACKED_BYTES);
    const section = reader.readSection(4);

    section.readUint(5);

    expect(section.isOverrun).toBe(true);
  });

  it('marks a section past the end as overrun', () => {
    const reader = createBitReader(PACKED_BYTES);

    reader.readSection(17);

    expect(reader.isOverrun).toBe(true);
  });
});
