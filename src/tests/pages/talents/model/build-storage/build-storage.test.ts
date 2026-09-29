import { describe, expect, it, vi } from 'vitest';

import {
  buildIdOfKey,
  orderedBuildIds,
  parseBuild,
  parseBuildOrder,
  serializeBuild,
} from '@pages/talents/model/build-storage';

import {
  BUILD_DATA_MOCK,
  BUILD_ID,
  BUILD_KEY_PREFIX,
  BUILD_MOCK,
  INVALID_CODE,
  ORDER_KEY,
  UNENCODABLE_BUILD_MOCK,
  VALID_CODE,
} from './build-storage.mock';

vi.mock('@features/share-build', async () => ({
  encodeSoldierBuild: (await import('./build-storage.mock')).encodeSoldierBuildMock,
  decodeSoldierBuild: (await import('./build-storage.mock')).decodeSoldierBuildMock,
}));

describe('buildIdOfKey', () => {
  it('reads the id of a build key', () => {
    const buildId = buildIdOfKey(`${BUILD_KEY_PREFIX}${BUILD_ID}`);

    expect(buildId).toBe(BUILD_ID);
  });

  it('returns null for a key of another record', () => {
    const buildId = buildIdOfKey(ORDER_KEY);

    expect(buildId).toBeNull();
  });
});

describe('serializeBuild', () => {
  it('stores the share code and the lock', () => {
    const value = serializeBuild({ ...BUILD_MOCK, readonly: true }) ?? '';

    expect(JSON.parse(value)).toEqual({ code: 'code-Overwatch', readonly: true });
  });

  it('returns null for a build without a share code', () => {
    const value = serializeBuild(UNENCODABLE_BUILD_MOCK);

    expect(value).toBeNull();
  });
});

describe('parseBuild', () => {
  it('restores the build with the id and the lock', () => {
    const build = parseBuild(BUILD_ID, JSON.stringify({ code: VALID_CODE, readonly: true }));

    expect(build).toEqual({ ...BUILD_DATA_MOCK, id: BUILD_ID, readonly: true });
  });

  it('returns null for invalid JSON', () => {
    const build = parseBuild(BUILD_ID, '{"code":');

    expect(build).toBeNull();
  });

  it('returns null for a record of another shape', () => {
    const build = parseBuild(BUILD_ID, JSON.stringify({ code: VALID_CODE, readonly: 'yes' }));

    expect(build).toBeNull();
  });

  it('returns null for an invalid share code', () => {
    const build = parseBuild(BUILD_ID, JSON.stringify({ code: INVALID_CODE, readonly: false }));

    expect(build).toBeNull();
  });
});

describe('parseBuildOrder', () => {
  it('reads the build ids', () => {
    const order = parseBuildOrder('["a","b"]');

    expect(order).toEqual(['a', 'b']);
  });

  it('returns null for invalid JSON', () => {
    const order = parseBuildOrder('["a"');

    expect(order).toBeNull();
  });

  it('returns null for a value that is not a list of ids', () => {
    const order = parseBuildOrder('{"a":1}');

    expect(order).toBeNull();
  });
});

describe('orderedBuildIds', () => {
  it('arranges the ids by the order', () => {
    const buildIds = orderedBuildIds(['c', 'a', 'b'], ['a', 'b', 'c']);

    expect(buildIds).toEqual(['c', 'a', 'b']);
  });

  it('puts ids missing from the order last', () => {
    const buildIds = orderedBuildIds(['b'], ['a', 'b', 'c']);

    expect(buildIds).toEqual(['b', 'a', 'c']);
  });

  it('skips ids of the order that are not present', () => {
    const buildIds = orderedBuildIds(['x', 'a'], ['a']);

    expect(buildIds).toEqual(['a']);
  });

  it('keeps the first place of a duplicated id', () => {
    const buildIds = orderedBuildIds(['b', 'a', 'b'], ['a', 'b']);

    expect(buildIds).toEqual(['b', 'a']);
  });
});
