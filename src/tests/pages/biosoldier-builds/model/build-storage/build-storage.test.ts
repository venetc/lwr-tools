import { describe, expect, it, vi } from 'vitest';

import { parseBuild, serializeBuild } from '@pages/biosoldier-builds/model/build-storage';

import {
  BUILD_DATA_MOCK,
  BUILD_ID,
  BUILD_MOCK,
  INVALID_CODE,
  UNENCODABLE_BUILD_MOCK,
  VALID_CODE,
} from './build-storage.mock';

vi.mock('@features/share-build', async () => ({
  encodeBiosoldierBuild: (await import('./build-storage.mock')).encodeBiosoldierBuildMock,
  decodeBiosoldierBuild: (await import('./build-storage.mock')).decodeBiosoldierBuildMock,
}));

describe('serializeBuild', () => {
  it('stores the share code and the lock', () => {
    const record = serializeBuild({ ...BUILD_MOCK, readonly: true });

    expect(record).toEqual({ code: 'code-Overwatch', readonly: true });
  });

  it('returns null for a build without a share code', () => {
    const record = serializeBuild(UNENCODABLE_BUILD_MOCK);

    expect(record).toBeNull();
  });
});

describe('parseBuild', () => {
  it('restores the build with the id and the lock', () => {
    const build = parseBuild(BUILD_ID, { code: VALID_CODE, readonly: true });

    expect(build).toEqual({ ...BUILD_DATA_MOCK, id: BUILD_ID, readonly: true });
  });

  it('returns null for a record of another shape', () => {
    const build = parseBuild(BUILD_ID, { code: VALID_CODE, readonly: 'yes' });

    expect(build).toBeNull();
  });

  it('returns null for an invalid share code', () => {
    const build = parseBuild(BUILD_ID, { code: INVALID_CODE, readonly: false });

    expect(build).toBeNull();
  });
});
