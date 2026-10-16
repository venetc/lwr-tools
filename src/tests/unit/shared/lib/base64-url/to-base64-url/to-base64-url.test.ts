import { describe, expect, it } from 'vitest';

import { toBase64Url } from '@shared/lib/base64-url/to-base64-url';

import { BYTES_WITH_URL_CHARS, SINGLE_BYTE, SINGLE_BYTE_TEXT, URL_CHARS_TEXT } from './to-base64-url.mock';

describe('toBase64Url', () => {
  it('uses "-" and "_" instead of "+" and "/"', () => {
    const text = toBase64Url(BYTES_WITH_URL_CHARS);

    expect(text).toBe(URL_CHARS_TEXT);
  });

  it('drops the padding', () => {
    const text = toBase64Url(SINGLE_BYTE);

    expect(text).toBe(SINGLE_BYTE_TEXT);
  });
});
