import { describe, expect, it } from 'vitest';

import { encodeBuild } from '@features/share-build/model/build-code';
import { readShareCode } from '@features/share-build/model/share-code';
import { encodeSquad } from '@features/share-build/model/squad-code';
import { encodeUnit } from '@features/share-build/model/unit-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  BIOSOLDIER_BUILD,
  GARBAGE_CODE,
  INVALID_RESULT,
  MEC_BUILD,
  MEC_LOADOUT,
  SEPARATOR,
  SERAPH_LOADOUT,
  SHIV_BUILD,
  SHIV_LOADOUT,
  SQUAD_NAME,
  UNKNOWN_FORMAT,
  UNKNOWN_SECTION,
} from './share-code.mock';

const SHIV_UNIT_CODE = encodeUnit({ kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT }) ?? '';

const MEC_UNIT_CODE = encodeUnit({ kind: 'mec', build: MEC_BUILD, loadout: MEC_LOADOUT }) ?? '';

describe('readShareCode of a Build code', () => {
  it('gives a biosoldier Unit without a Loadout', () => {
    const result = readShareCode(encodeBuild('biosoldier', BIOSOLDIER_BUILD) ?? '');

    expect(result).toEqual({ status: 'unit', unit: { kind: 'biosoldier', build: BIOSOLDIER_BUILD, loadout: null } });
  });

  it('gives a MEC Unit without a Loadout', () => {
    const result = readShareCode(encodeBuild('mec', MEC_BUILD) ?? '');

    expect(result).toEqual({ status: 'unit', unit: { kind: 'mec', build: MEC_BUILD, loadout: null } });
  });

  it('gives a SHIV Unit without a Loadout', () => {
    const result = readShareCode(encodeBuild('shiv', SHIV_BUILD) ?? '');

    expect(result).toEqual({ status: 'unit', unit: { kind: 'shiv', build: SHIV_BUILD, loadout: null } });
  });
});

describe('readShareCode of a Unit code', () => {
  it('gives a biosoldier Unit with its Loadout', () => {
    const result = readShareCode(encodeUnit({ kind: 'biosoldier', build: BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT }) ?? '');

    expect(result).toEqual({ status: 'unit', unit: { kind: 'biosoldier', build: BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT } });
  });

  it('gives a MEC Unit with its Loadout', () => {
    const result = readShareCode(MEC_UNIT_CODE);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'mec', build: MEC_BUILD, loadout: MEC_LOADOUT } });
  });

  it('gives a SHIV Unit with its Loadout', () => {
    const result = readShareCode(SHIV_UNIT_CODE);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT } });
  });
});

describe('readShareCode of a Squad code', () => {
  it('gives the Squad', () => {
    const code = encodeSquad({ name: SQUAD_NAME, units: [{ kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT }] }) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({
      status: 'squad',
      squad: { name: SQUAD_NAME, builds: [{ kind: 'shiv', build: SHIV_BUILD }], units: [{ buildIndex: 0, loadout: SHIV_LOADOUT }] },
    });
  });

  it('gives invalid for a Squad code with a broken part', () => {
    const code = encodeSquad({ name: SQUAD_NAME, units: [{ kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT }] }) ?? '';

    const result = readShareCode(code.slice(0, -1));

    expect(result).toEqual(INVALID_RESULT);
  });
});

describe('readShareCode of no known code', () => {
  it('gives invalid for a code of an unknown format', () => {
    const result = readShareCode(encodeBinaryCode(UNKNOWN_FORMAT, [UNKNOWN_SECTION]) ?? '');

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for text that is no code', () => {
    const result = readShareCode(GARBAGE_CODE);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for several parts without a Squad header', () => {
    const result = readShareCode([SHIV_UNIT_CODE, MEC_UNIT_CODE].join(SEPARATOR));

    expect(result).toEqual(INVALID_RESULT);
  });
});
