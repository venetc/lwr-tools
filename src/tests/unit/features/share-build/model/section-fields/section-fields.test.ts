import { describe, expect, it } from 'vitest';

import { readCodeList, readWholeSection, writeCodeList } from '@features/share-build/model/section-fields';
import { createBitWriter } from '@shared/lib/bit-stream';

import {
  CODE_BITS,
  COUNT_BITS,
  FIELD_VALUE,
  fieldReader,
  FULL_CODES,
  NARROW_CODE_BITS,
  NARROW_CODES,
  readerOf,
  readField,
  readTwoFields,
} from './section-fields.mock';

describe('writeCodeList', () => {
  it('writes only the count for an empty list', () => {
    const writer = createBitWriter();

    writeCodeList(writer, [], COUNT_BITS, CODE_BITS);

    expect(writer.bitLength).toBe(COUNT_BITS);
  });

  it('writes the count and every code', () => {
    const writer = createBitWriter();

    writeCodeList(writer, FULL_CODES, COUNT_BITS, CODE_BITS);

    expect(writer.bitLength).toBe(COUNT_BITS + FULL_CODES.length * CODE_BITS);
  });
});

describe('readCodeList', () => {
  it('reads an empty list', () => {
    const writer = createBitWriter();
    writeCodeList(writer, [], COUNT_BITS, CODE_BITS);

    const codes = readCodeList(readerOf(writer), COUNT_BITS, CODE_BITS);

    expect(codes).toEqual([]);
  });

  it('reads a list of the longest count', () => {
    const writer = createBitWriter();
    writeCodeList(writer, FULL_CODES, COUNT_BITS, CODE_BITS);

    const codes = readCodeList(readerOf(writer), COUNT_BITS, CODE_BITS);

    expect(codes).toEqual(FULL_CODES);
  });

  it('reads codes of another width', () => {
    const writer = createBitWriter();
    writeCodeList(writer, NARROW_CODES, COUNT_BITS, NARROW_CODE_BITS);

    const codes = readCodeList(readerOf(writer), COUNT_BITS, NARROW_CODE_BITS);

    expect(codes).toEqual(NARROW_CODES);
  });

  it('reads the list to its last bit', () => {
    const writer = createBitWriter();
    writeCodeList(writer, NARROW_CODES, COUNT_BITS, NARROW_CODE_BITS);
    const reader = readerOf(writer);

    readCodeList(reader, COUNT_BITS, NARROW_CODE_BITS);

    expect(reader.isComplete).toBe(true);
  });
});

describe('readWholeSection', () => {
  it('gives the fields of a section read exactly to its end', () => {
    const fields = readWholeSection(fieldReader(), readField);

    expect(fields).toBe(FIELD_VALUE);
  });

  it('gives null for a section with unread bits', () => {
    const fields = readWholeSection(fieldReader(1), readField);

    expect(fields).toBeNull();
  });

  it('gives null for a section read past its end', () => {
    const fields = readWholeSection(fieldReader(), readTwoFields);

    expect(fields).toBeNull();
  });
});
