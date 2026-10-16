import { describe, expect, it } from 'vitest';

import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  CODE_WITH_BYTE_AFTER_END_ID,
  CODE_WITH_DESCENDING_IDS,
  CODE_WITH_SECTION_PAST_END,
  CODE_WITH_WRONG_CHECKSUM,
  CODE_WITHOUT_END_ID,
  DUPLICATE_SECTION,
  FIRST_SECTION,
  FORMAT,
  SECOND_SECTION,
} from './open-binary-code.mock';

describe('openBinaryCode', () => {
  it('reads the format', () => {
    const code = encodeBinaryCode(FORMAT, [FIRST_SECTION]) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.format).toBe(FORMAT);
  });

  it('reads the section fields', () => {
    const code = encodeBinaryCode(FORMAT, [FIRST_SECTION, SECOND_SECTION]) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.get(SECOND_SECTION.id)?.readUint(2)).toBe(0b01);
  });

  it('limits a section reader to its section', () => {
    const code = encodeBinaryCode(FORMAT, [FIRST_SECTION, SECOND_SECTION]) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.get(FIRST_SECTION.id)?.remainingBits).toBe(4);
  });

  it('opens a code without sections', () => {
    const code = encodeBinaryCode(FORMAT, []) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.size).toBe(0);
  });

  it('ignores surrounding whitespace', () => {
    const code = encodeBinaryCode(FORMAT, [FIRST_SECTION]) ?? '';

    const binaryCode = openBinaryCode(` ${code}\n`);

    expect(binaryCode?.format).toBe(FORMAT);
  });

  it('rejects a string that is not base64url', () => {
    const binaryCode = openBinaryCode('not a code!');

    expect(binaryCode).toBeNull();
  });

  it('rejects a code shorter than two bytes', () => {
    const binaryCode = openBinaryCode('Bw');

    expect(binaryCode).toBeNull();
  });

  it('rejects a wrong checksum', () => {
    const binaryCode = openBinaryCode(CODE_WITH_WRONG_CHECKSUM);

    expect(binaryCode).toBeNull();
  });

  it('rejects repeated section ids', () => {
    const code = encodeBinaryCode(FORMAT, [FIRST_SECTION, DUPLICATE_SECTION]) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode).toBeNull();
  });

  it('rejects descending section ids', () => {
    const binaryCode = openBinaryCode(CODE_WITH_DESCENDING_IDS);

    expect(binaryCode).toBeNull();
  });

  it('rejects a section running past the data', () => {
    const binaryCode = openBinaryCode(CODE_WITH_SECTION_PAST_END);

    expect(binaryCode).toBeNull();
  });

  it('rejects a code without the end id', () => {
    const binaryCode = openBinaryCode(CODE_WITHOUT_END_ID);

    expect(binaryCode).toBeNull();
  });

  it('rejects whole bytes after the end id', () => {
    const binaryCode = openBinaryCode(CODE_WITH_BYTE_AFTER_END_ID);

    expect(binaryCode).toBeNull();
  });
});
