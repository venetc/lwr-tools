import { describe, expect, it } from 'vitest';

import { encodeBuild } from '@features/share-build';
import { storedBuildCodec } from '@widgets/build-calculator/model/stored-build';

import {
  BUILD_ID,
  COLLISION_BUILD,
  COLLISION_RECORD,
  GAPPED_MEC_BUILD,
  INVALID_CODE,
  MEC_BUILD,
  OUTDATED_MEC_BUILD,
  OUTDATED_MEC_RECORD,
  SHIV_BUILD,
  SIGNATURE_MEC_BUILD,
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

  it('stores a record that restores the Signature skill', () => {
    const record = mecCodec.serialize(SIGNATURE_MEC_BUILD);

    expect(mecCodec.parse(BUILD_ID, record)).toEqual(SIGNATURE_MEC_BUILD);
  });

  it('stores an Outdated build as its stored record', () => {
    const record = mecCodec.serialize(OUTDATED_MEC_BUILD);

    expect(record).toEqual(OUTDATED_MEC_RECORD);
  });

  it('stores an Outdated SHIV build as its stored record', () => {
    const record = serialize(COLLISION_BUILD);

    expect(record).toEqual(COLLISION_RECORD);
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

  it('gives a SHIV code with Outdated selections as an Outdated build with the code and the selections', () => {
    const build = parse(BUILD_ID, COLLISION_RECORD);

    expect(build).toEqual(COLLISION_BUILD);
  });

  it('returns null for a build code of another unit type', () => {
    const build = parse(BUILD_ID, { code: encodeBuild('mec', MEC_BUILD), readonly: false });

    expect(build).toBeNull();
  });
});
