import { describe, expect, it } from 'vitest';

import { encodeShareCode, openShareCode } from '@shared/lib/share-code';

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
} from './share-code.mock';

describe('encodeShareCode', () => {
  it('writes sections in ascending id order whatever order they come in', () => {
    const ascendingCode = encodeShareCode(FORMAT, [FIRST_SECTION, SECOND_SECTION]);

    const descendingCode = encodeShareCode(FORMAT, [SECOND_SECTION, FIRST_SECTION]);

    expect(descendingCode).toBe(ascendingCode);
  });
});

describe('openShareCode', () => {
  it('reads the format', () => {
    const code = encodeShareCode(FORMAT, [FIRST_SECTION]);

    const shareCode = openShareCode(code);

    expect(shareCode?.format).toBe(FORMAT);
  });

  it('reads the section fields', () => {
    const code = encodeShareCode(FORMAT, [FIRST_SECTION, SECOND_SECTION]);

    const shareCode = openShareCode(code);

    expect(shareCode?.sections.get(SECOND_SECTION.id)?.readUint(2)).toBe(0b01);
  });

  it('limits a section reader to its section', () => {
    const code = encodeShareCode(FORMAT, [FIRST_SECTION, SECOND_SECTION]);

    const shareCode = openShareCode(code);

    expect(shareCode?.sections.get(FIRST_SECTION.id)?.remainingBits).toBe(4);
  });

  it('opens a code without sections', () => {
    const code = encodeShareCode(FORMAT, []);

    const shareCode = openShareCode(code);

    expect(shareCode?.sections.size).toBe(0);
  });

  it('ignores surrounding whitespace', () => {
    const code = encodeShareCode(FORMAT, [FIRST_SECTION]);

    const shareCode = openShareCode(` ${code}\n`);

    expect(shareCode?.format).toBe(FORMAT);
  });

  it('rejects a string that is not base64url', () => {
    const shareCode = openShareCode('not a code!');

    expect(shareCode).toBeNull();
  });

  it('rejects a code shorter than two bytes', () => {
    const shareCode = openShareCode('Bw');

    expect(shareCode).toBeNull();
  });

  it('rejects a wrong checksum', () => {
    const shareCode = openShareCode(CODE_WITH_WRONG_CHECKSUM);

    expect(shareCode).toBeNull();
  });

  it('rejects repeated section ids', () => {
    const code = encodeShareCode(FORMAT, [FIRST_SECTION, DUPLICATE_SECTION]);

    const shareCode = openShareCode(code);

    expect(shareCode).toBeNull();
  });

  it('rejects descending section ids', () => {
    const shareCode = openShareCode(CODE_WITH_DESCENDING_IDS);

    expect(shareCode).toBeNull();
  });

  it('rejects a section running past the data', () => {
    const shareCode = openShareCode(CODE_WITH_SECTION_PAST_END);

    expect(shareCode).toBeNull();
  });

  it('rejects a code without the end id', () => {
    const shareCode = openShareCode(CODE_WITHOUT_END_ID);

    expect(shareCode).toBeNull();
  });

  it('rejects whole bytes after the end id', () => {
    const shareCode = openShareCode(CODE_WITH_BYTE_AFTER_END_ID);

    expect(shareCode).toBeNull();
  });
});
