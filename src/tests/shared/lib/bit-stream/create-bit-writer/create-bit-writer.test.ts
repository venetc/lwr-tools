import { describe, expect, it } from 'vitest';

import { createBitReader } from '@shared/lib/bit-stream/create-bit-reader';
import { createBitWriter } from '@shared/lib/bit-stream/create-bit-writer';

import { MULTIBYTE_TEXT } from './create-bit-writer.mock';

describe('createBitWriter', () => {
  it('packs bits most significant first and pads the last byte with zeros', () => {
    const writer = createBitWriter();
    writer.writeUint(0b101, 3);
    writer.writeUint(0b110011, 6);

    const bytes = writer.toBytes();

    expect([...bytes]).toEqual([0b10111001, 0b10000000]);
  });

  it('counts the written bits', () => {
    const writer = createBitWriter();

    writer.writeUint(0, 3);
    writer.writeUint(0, 9);

    expect(writer.bitLength).toBe(12);
  });

  it('appends the bits of another writer', () => {
    const writer = createBitWriter();
    const appended = createBitWriter();
    writer.writeUint(0b1, 1);
    appended.writeUint(0b01, 2);

    writer.append(appended);

    expect([...writer.toBytes()]).toEqual([0b10100000]);
  });

  it('adds the appended bits to the length', () => {
    const writer = createBitWriter();
    const appended = createBitWriter();
    writer.writeUint(0, 1);
    appended.writeUint(0, 10);

    writer.append(appended);

    expect(writer.bitLength).toBe(11);
  });

  it('cuts a long string at a character boundary', () => {
    const writer = createBitWriter();

    writer.writeString(MULTIBYTE_TEXT, 2);

    expect(createBitReader(writer.toBytes()).readString(2)).toBe('ab');
  });
});
