import { describe, expect, it } from 'vitest';

import { encodeBuild } from '@features/share-build/model/build-code';
import { storedBuildCodec } from '@features/share-build/model/stored-build';

import { BUILD_ID, INVALID_CODE, MEC_BUILD, SHIV_BUILD, UNENCODABLE_SHIV_BUILD } from './stored-build.mock';

const { serialize, parse } = storedBuildCodec('shiv');

describe('storedBuildCodec serialize', () => {
  it('stores a record that restores the build with the id and the lock', () => {
    const record = serialize(SHIV_BUILD);

    expect(parse(BUILD_ID, record)).toEqual(SHIV_BUILD);
  });

  it('returns null for a build without a share code', () => {
    const record = serialize(UNENCODABLE_SHIV_BUILD);

    expect(record).toBeNull();
  });
});

describe('storedBuildCodec parse', () => {
  it('returns null for a record of another shape', () => {
    const build = parse(BUILD_ID, { code: serialize(SHIV_BUILD)?.code, readonly: 'yes' });

    expect(build).toBeNull();
  });

  it('returns null for an invalid share code', () => {
    const build = parse(BUILD_ID, { code: INVALID_CODE, readonly: false });

    expect(build).toBeNull();
  });

  it('returns null for a build code of another unit type', () => {
    const build = parse(BUILD_ID, { code: encodeBuild('mec', MEC_BUILD), readonly: false });

    expect(build).toBeNull();
  });
});
