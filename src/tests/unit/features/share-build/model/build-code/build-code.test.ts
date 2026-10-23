import { describe, expect, it } from 'vitest';

import { encodeBuild } from '@features/share-build/model/build-code';
import { readShareCode } from '@features/share-build/model/share-code';

import { BIOSOLDIER_BUILDS, FULL_TREE_BIOSOLDIER_BUILDS, FULL_TREE_MEC_BUILDS, MEC_BUILDS, SHIV_BUILDS } from './build-code.mock';

describe('biosoldier build code round trip', () => {
  it.each(FULL_TREE_BIOSOLDIER_BUILDS)('restores a %s build with its full class tree', (_, build) => {
    const code = encodeBuild('biosoldier', build) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'biosoldier', build, loadout: null } });
  });

  it.each(BIOSOLDIER_BUILDS)('restores a build: %s', (_, build) => {
    const code = encodeBuild('biosoldier', build) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'biosoldier', build, loadout: null } });
  });
});

describe('mec build code round trip', () => {
  it.each(FULL_TREE_MEC_BUILDS)('restores a %s build with its full class tree', (_, build) => {
    const code = encodeBuild('mec', build) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'mec', build, loadout: null } });
  });

  it.each(MEC_BUILDS)('restores a build: %s', (_, build) => {
    const code = encodeBuild('mec', build) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'mec', build, loadout: null } });
  });
});

describe('shiv build code round trip', () => {
  it.each(SHIV_BUILDS)('restores a build: %s', (_, build) => {
    const code = encodeBuild('shiv', build) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'shiv', build, loadout: null } });
  });
});
