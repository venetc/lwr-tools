import { describe, expect, it } from 'vitest';

import { BUILD_CODECS } from '@features/share-build/model/build-codecs';
import { decodeBuildImport } from '@features/share-build/model/build-import';
import { encodeSquad } from '@features/share-build/model/squad-code';

import { BIOSOLDIER_BUILD, EMPTY_LOADOUT, INVALID_RESULT, OTHER_UNIT_RESULT, SHIV_BUILD, SQUAD_CODE_RESULT, SQUAD_NAME } from './build-import.mock';

const SQUAD_CODE = encodeSquad({
  name: SQUAD_NAME,
  units: [{ kind: 'shiv', build: SHIV_BUILD, loadout: EMPTY_LOADOUT }],
}) ?? '';

describe('decodeBuildImport', () => {
  it('gives the build of a build code of the kind', () => {
    const result = decodeBuildImport('biosoldier', BUILD_CODECS.biosoldier.encode(BIOSOLDIER_BUILD) ?? '');

    expect(result).toEqual({ status: 'decoded', build: BIOSOLDIER_BUILD });
  });

  it('reports a build code of another unit', () => {
    const result = decodeBuildImport('biosoldier', BUILD_CODECS.shiv.encode(SHIV_BUILD) ?? '');

    expect(result).toEqual(OTHER_UNIT_RESULT);
  });

  it('recognizes a Squad code', () => {
    const result = decodeBuildImport('biosoldier', SQUAD_CODE);

    expect(result).toEqual(SQUAD_CODE_RESULT);
  });

  it('recognizes a Squad code of an empty Squad', () => {
    const result = decodeBuildImport('mec', encodeSquad({ name: SQUAD_NAME, units: [] }) ?? '');

    expect(result).toEqual(SQUAD_CODE_RESULT);
  });

  it('gives invalid for a Squad code with a broken part', () => {
    const result = decodeBuildImport('shiv', SQUAD_CODE.slice(0, -1));

    expect(result).toEqual(INVALID_RESULT);
  });
});
