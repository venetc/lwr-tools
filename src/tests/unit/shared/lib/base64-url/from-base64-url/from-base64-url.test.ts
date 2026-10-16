import { describe, expect, it } from 'vitest';

import { fromBase64Url } from '@shared/lib/base64-url/from-base64-url';

import { INVALID_LENGTH_TEXT, STANDARD_BASE64_TEXT, URL_CHARS_BYTES, URL_CHARS_TEXT } from './from-base64-url.mock';

describe('fromBase64Url', () => {
  it('decodes "-" and "_" without padding', () => {
    const bytes = fromBase64Url(URL_CHARS_TEXT);

    expect([...bytes ?? []]).toEqual(URL_CHARS_BYTES);
  });

  it('rejects standard base64 characters', () => {
    const bytes = fromBase64Url(STANDARD_BASE64_TEXT);

    expect(bytes).toBeNull();
  });

  it('rejects a string of impossible length', () => {
    const bytes = fromBase64Url(INVALID_LENGTH_TEXT);

    expect(bytes).toBeNull();
  });
});
