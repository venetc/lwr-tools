import { describe, expect, it } from 'vitest';

import { encodeBuild } from '@features/share-build/model/build-code';
import { readShareCode } from '@features/share-build/model/share-code';
import { encodeSquad } from '@features/share-build/model/squad-code';
import { encodeUnit } from '@features/share-build/model/unit-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  INVALID_RESULT,
  LONG_NAME_SECTION,
  MEC_BUILD,
  MEC_LOADOUT,
  NAME_SECTION,
  OFFICER_BUILD,
  OTHER_OFFICER_BUILD,
  SEPARATOR,
  SERAPH_LOADOUT,
  SHIV_BUILD,
  SHIV_LOADOUT,
  SHIV_UNIT,
  SQUAD_FORMAT,
  SQUAD_NAME,
  UNKNOWN_SECTION,
  VEST_LOADOUT,
} from './squad-code.mock';

const HEADER = encodeBinaryCode(SQUAD_FORMAT, [NAME_SECTION]) ?? '';

const SHIV_UNIT_CODE = encodeUnit(SHIV_UNIT) ?? '';

const MEC_UNIT_CODE = encodeUnit({ kind: 'mec', build: MEC_BUILD, loadout: MEC_LOADOUT }) ?? '';

describe('squad code round trip', () => {
  it('restores a Squad of Units of every kind', () => {
    const code = encodeSquad({
      name: SQUAD_NAME,
      units: [
        { kind: 'biosoldier', build: OFFICER_BUILD, loadout: SERAPH_LOADOUT },
        { kind: 'mec', build: MEC_BUILD, loadout: MEC_LOADOUT },
        { kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT },
      ],
    }) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({
      status: 'squad',
      squad: {
        name: SQUAD_NAME,
        builds: [
          { kind: 'biosoldier', build: OFFICER_BUILD },
          { kind: 'mec', build: MEC_BUILD },
          { kind: 'shiv', build: SHIV_BUILD },
        ],
        units: [
          { buildIndex: 0, loadout: SERAPH_LOADOUT },
          { buildIndex: 1, loadout: MEC_LOADOUT },
          { buildIndex: 2, loadout: SHIV_LOADOUT },
        ],
      },
    });
  });
});

describe('squad code builds', () => {
  it('gives one build to Units with the same build sections', () => {
    const code = encodeSquad({
      name: SQUAD_NAME,
      units: [
        { kind: 'biosoldier', build: OFFICER_BUILD, loadout: SERAPH_LOADOUT },
        { kind: 'biosoldier', build: OFFICER_BUILD, loadout: VEST_LOADOUT },
      ],
    }) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({
      status: 'squad',
      squad: {
        name: SQUAD_NAME,
        builds: [{ kind: 'biosoldier', build: OFFICER_BUILD }],
        units: [{ buildIndex: 0, loadout: SERAPH_LOADOUT }, { buildIndex: 0, loadout: VEST_LOADOUT }],
      },
    });
  });

  it('gives two builds to Units with the same class tree and other officer perks', () => {
    const code = encodeSquad({
      name: SQUAD_NAME,
      units: [
        { kind: 'biosoldier', build: OFFICER_BUILD, loadout: SERAPH_LOADOUT },
        { kind: 'biosoldier', build: OTHER_OFFICER_BUILD, loadout: SERAPH_LOADOUT },
      ],
    }) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({
      status: 'squad',
      squad: {
        name: SQUAD_NAME,
        builds: [{ kind: 'biosoldier', build: OFFICER_BUILD }, { kind: 'biosoldier', build: OTHER_OFFICER_BUILD }],
        units: [{ buildIndex: 0, loadout: SERAPH_LOADOUT }, { buildIndex: 1, loadout: SERAPH_LOADOUT }],
      },
    });
  });
});

describe('encodeSquad', () => {
  it('joins the Squad header and the Unit codes with dots', () => {
    const code = encodeSquad({ name: SQUAD_NAME, units: [SHIV_UNIT] });

    expect(code).toBe([HEADER, SHIV_UNIT_CODE].join(SEPARATOR));
  });

  it('gives the Squad header alone for an empty Squad', () => {
    const code = encodeSquad({ name: SQUAD_NAME, units: [] });

    expect(code).toBe(HEADER);
  });
});

describe('readShareCode of a Squad code', () => {
  it('reads an empty Squad of the header alone', () => {
    const result = readShareCode(HEADER);

    expect(result).toEqual({ status: 'squad', squad: { name: SQUAD_NAME, builds: [], units: [] } });
  });

  it('gives a Unit without a Loadout for a build code part', () => {
    const code = [HEADER, encodeBuild('shiv', SHIV_BUILD)].join(SEPARATOR);

    const result = readShareCode(code);

    expect(result).toEqual({
      status: 'squad',
      squad: { name: SQUAD_NAME, builds: [{ kind: 'shiv', build: SHIV_BUILD }], units: [{ buildIndex: 0, loadout: null }] },
    });
  });

  it('skips unknown sections of the header', () => {
    const code = encodeBinaryCode(SQUAD_FORMAT, [NAME_SECTION, UNKNOWN_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'squad', squad: { name: SQUAD_NAME, builds: [], units: [] } });
  });

  it('gives invalid for a broken Unit part', () => {
    const code = [HEADER, SHIV_UNIT_CODE.slice(0, -1), MEC_UNIT_CODE].join(SEPARATOR);

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a broken header', () => {
    const code = [HEADER.slice(0, -1), SHIV_UNIT_CODE].join(SEPARATOR);

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for an empty part', () => {
    const code = [HEADER, SHIV_UNIT_CODE, ''].join(SEPARATOR);

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a header without the NAME section', () => {
    const code = [encodeBinaryCode(SQUAD_FORMAT, [UNKNOWN_SECTION]), SHIV_UNIT_CODE].join(SEPARATOR);

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a NAME section with extra bits', () => {
    const code = encodeBinaryCode(SQUAD_FORMAT, [LONG_NAME_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a Squad header as a Unit part', () => {
    const code = [HEADER, HEADER].join(SEPARATOR);

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });
});
