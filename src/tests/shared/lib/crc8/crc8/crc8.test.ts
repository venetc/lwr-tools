import { describe, expect, it } from 'vitest';

import { crc8 } from '@shared/lib/crc8/crc8';

import { CHECK_BYTES, CHECK_VALUE, EMPTY_BYTES } from './crc8.mock';

describe('crc8', () => {
  it('gives the standard check value for "123456789"', () => {
    const checksum = crc8(CHECK_BYTES);

    expect(checksum).toBe(CHECK_VALUE);
  });

  it('gives 0 for no bytes', () => {
    const checksum = crc8(EMPTY_BYTES);

    expect(checksum).toBe(0);
  });
});
