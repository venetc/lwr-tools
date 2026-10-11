import { describe, expect, it } from 'vitest';

import { storedBuildCodec } from '@features/share-build/model/stored-build';

import {
  BUILD_DATA_MOCK,
  BUILD_ID,
  BUILD_MOCK,
  decodeMock,
  encodeMock,
  INVALID_CODE,
  UNENCODABLE_BUILD_MOCK,
  VALID_CODE,
} from './stored-build.mock';

const { serialize, parse } = storedBuildCodec(encodeMock, decodeMock);

describe('storedBuildCodec serialize', () => {
  it('stores the share code and the lock', () => {
    const record = serialize({ ...BUILD_MOCK, readonly: true });

    expect(record).toEqual({ code: 'code-Overwatch', readonly: true });
  });

  it('returns null for a build without a share code', () => {
    const record = serialize(UNENCODABLE_BUILD_MOCK);

    expect(record).toBeNull();
  });
});

describe('storedBuildCodec parse', () => {
  it('restores the build with the id and the lock', () => {
    const build = parse(BUILD_ID, { code: VALID_CODE, readonly: true });

    expect(build).toEqual({ ...BUILD_DATA_MOCK, id: BUILD_ID, readonly: true });
  });

  it('returns null for a record of another shape', () => {
    const build = parse(BUILD_ID, { code: VALID_CODE, readonly: 'yes' });

    expect(build).toBeNull();
  });

  it('returns null for an invalid share code', () => {
    const build = parse(BUILD_ID, { code: INVALID_CODE, readonly: false });

    expect(build).toBeNull();
  });
});
