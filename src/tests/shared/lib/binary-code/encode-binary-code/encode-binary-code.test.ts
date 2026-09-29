import { describe, expect, it } from 'vitest';

import { encodeBinaryCode } from '@shared/lib/binary-code';

import { FIRST_SECTION, FORMAT, LONGEST_SECTION, SECOND_SECTION, TOO_LONG_SECTION } from './encode-binary-code.mock';

describe('encodeBinaryCode', () => {
  it('writes sections in ascending id order whatever order they come in', () => {
    const ascendingCode = encodeBinaryCode(FORMAT, [FIRST_SECTION, SECOND_SECTION]);

    const descendingCode = encodeBinaryCode(FORMAT, [SECOND_SECTION, FIRST_SECTION]);

    expect(descendingCode).toBe(ascendingCode);
  });

  it('writes a section of the longest length', () => {
    const code = encodeBinaryCode(FORMAT, [LONGEST_SECTION]);

    expect(code).not.toBeNull();
  });

  it('gives null for a section longer than its length field holds', () => {
    const code = encodeBinaryCode(FORMAT, [FIRST_SECTION, TOO_LONG_SECTION]);

    expect(code).toBeNull();
  });
});
