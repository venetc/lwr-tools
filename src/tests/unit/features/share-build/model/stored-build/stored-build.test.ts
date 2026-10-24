import { describe, expect, it } from 'vitest';

import { encodeBuild } from '@features/share-build/model/build-code';
import { storedBuildCodec } from '@features/share-build/model/stored-build';

import {
  BUILD_ID,
  COLLISION_CODE,
  GAPPED_MEC_BUILD,
  INVALID_CODE,
  MEC_BUILD,
  OUTDATED_MEC_BUILD,
  OUTDATED_MEC_RECORD,
  SHIV_BUILD,
  UNENCODABLE_SHIV_BUILD,
} from './stored-build.mock';

const { serialize, parse } = storedBuildCodec('shiv');

const mecCodec = storedBuildCodec('mec');

describe('storedBuildCodec serialize', () => {
  it('stores a record that restores the build with the id and the lock', () => {
    const record = serialize(SHIV_BUILD);

    expect(parse(BUILD_ID, record)).toEqual(SHIV_BUILD);
  });

  it('stores a record that restores a build with empty ranks', () => {
    const record = mecCodec.serialize(GAPPED_MEC_BUILD);

    expect(mecCodec.parse(BUILD_ID, record)).toEqual(GAPPED_MEC_BUILD);
  });

  it('stores an Outdated build as its stored record', () => {
    const record = mecCodec.serialize(OUTDATED_MEC_BUILD);

    expect(record).toEqual(OUTDATED_MEC_RECORD);
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

  it('gives a code with Outdated selections as an Outdated build with the code and the selections', () => {
    const build = mecCodec.parse(BUILD_ID, OUTDATED_MEC_RECORD);

    expect(build).toEqual(OUTDATED_MEC_BUILD);
  });

  it('keeps the code of a SHIV code with Outdated selections in the Outdated build', () => {
    const build = parse(BUILD_ID, { code: COLLISION_CODE, readonly: false });

    expect(build?.outdated?.code).toBe(COLLISION_CODE);
  });

  it('returns null for a build code of another unit type', () => {
    const build = parse(BUILD_ID, { code: encodeBuild('mec', MEC_BUILD), readonly: false });

    expect(build).toBeNull();
  });
});
