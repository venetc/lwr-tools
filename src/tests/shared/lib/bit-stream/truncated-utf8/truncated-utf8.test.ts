import { describe, expect, it } from 'vitest';

import { truncatedUtf8 } from '@shared/lib/bit-stream/truncated-utf8';

import { BYTES_BEFORE_CHAR, LIMIT_INSIDE_CHAR, MULTIBYTE_TEXT, MULTIBYTE_TEXT_BYTES } from './truncated-utf8.mock';

describe('truncatedUtf8', () => {
  it('keeps a text that fits the limit', () => {
    const bytes = truncatedUtf8(MULTIBYTE_TEXT, MULTIBYTE_TEXT_BYTES.length);

    expect(bytes).toEqual(MULTIBYTE_TEXT_BYTES);
  });

  it('drops a character that does not fit whole', () => {
    const bytes = truncatedUtf8(MULTIBYTE_TEXT, LIMIT_INSIDE_CHAR);

    expect(bytes).toEqual(BYTES_BEFORE_CHAR);
  });
});
