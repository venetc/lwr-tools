import { describe, expect, it } from 'vitest';

import { BUILD_CODECS } from '@features/share-build/model/build-codecs';

import { BIOSOLDIER_BUILDS, FULL_TREE_BIOSOLDIER_BUILDS, FULL_TREE_MEC_BUILDS, MEC_BUILDS, SHIV_BUILDS } from './build-codecs.mock';

describe('biosoldier build codec round trip', () => {
  it.each(FULL_TREE_BIOSOLDIER_BUILDS)('restores a %s build with its full class tree', (_, build) => {
    const code = BUILD_CODECS.biosoldier.encode(build) ?? '';

    const result = BUILD_CODECS.biosoldier.decode(code);

    expect(result).toEqual({ status: 'decoded', build });
  });

  it.each(BIOSOLDIER_BUILDS)('restores a build: %s', (_, build) => {
    const code = BUILD_CODECS.biosoldier.encode(build) ?? '';

    const result = BUILD_CODECS.biosoldier.decode(code);

    expect(result).toEqual({ status: 'decoded', build });
  });
});

describe('mec build codec round trip', () => {
  it.each(FULL_TREE_MEC_BUILDS)('restores a %s build with its full class tree', (_, build) => {
    const code = BUILD_CODECS.mec.encode(build) ?? '';

    const result = BUILD_CODECS.mec.decode(code);

    expect(result).toEqual({ status: 'decoded', build });
  });

  it.each(MEC_BUILDS)('restores a build: %s', (_, build) => {
    const code = BUILD_CODECS.mec.encode(build) ?? '';

    const result = BUILD_CODECS.mec.decode(code);

    expect(result).toEqual({ status: 'decoded', build });
  });
});

describe('shiv build codec round trip', () => {
  it.each(SHIV_BUILDS)('restores a build: %s', (_, build) => {
    const code = BUILD_CODECS.shiv.encode(build) ?? '';

    const result = BUILD_CODECS.shiv.decode(code);

    expect(result).toEqual({ status: 'decoded', build });
  });
});
