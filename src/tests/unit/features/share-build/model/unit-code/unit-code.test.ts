import { describe, expect, it } from 'vitest';

import { BUILD_CODE_LAYOUTS, BUILD_CODECS } from '@features/share-build/model/build-codecs';
import { decodeUnit, encodeUnit } from '@features/share-build/model/unit-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  BIOSOLDIER_FORMAT,
  CUT_LOADOUT_SECTION,
  GARBAGE_CODE,
  INVALID_RESULT,
  LONG_LOADOUT_SECTION,
  MEC_BUILD,
  MEC_LOADOUT,
  OFFICER_BUILD,
  OVERFULL_LOADOUT,
  PLAIN_BIOSOLDIER_BUILD,
  SERAPH_LOADOUT,
  SERAPH_LOADOUT_SECTION,
  SHIV_BUILD,
  SHIV_LOADOUT,
  UNKNOWN_ARMOR_LOADOUT,
  UNKNOWN_ARMOR_SECTION,
  UNKNOWN_FORMAT,
  UNKNOWN_SECTION,
} from './unit-code.mock';

const PLAIN_BUILD_SECTIONS = BUILD_CODE_LAYOUTS.biosoldier.writeBuild(PLAIN_BIOSOLDIER_BUILD) ?? [];

describe('unit code round trip', () => {
  it('restores a biosoldier Unit with officer perks and its Loadout', () => {
    const unit = { kind: 'biosoldier', build: OFFICER_BUILD, loadout: SERAPH_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit });
  });

  it('restores Seraph Armor of a biosoldier Unit without officer perks', () => {
    const unit = { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit });
  });

  it('restores a MEC Unit with its Modules', () => {
    const unit = { kind: 'mec', build: MEC_BUILD, loadout: MEC_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit });
  });

  it('restores a SHIV Unit with its SHIV type', () => {
    const unit = { kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit });
  });
});

describe('build code read as a Unit', () => {
  it('gives a biosoldier Unit without a Loadout', () => {
    const code = BUILD_CODECS.biosoldier.encode(OFFICER_BUILD) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit: { kind: 'biosoldier', build: OFFICER_BUILD, loadout: null } });
  });

  it('gives a MEC Unit without a Loadout', () => {
    const code = BUILD_CODECS.mec.encode(MEC_BUILD) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit: { kind: 'mec', build: MEC_BUILD, loadout: null } });
  });

  it('gives a SHIV Unit without a Loadout', () => {
    const code = BUILD_CODECS.shiv.encode(SHIV_BUILD) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit: { kind: 'shiv', build: SHIV_BUILD, loadout: null } });
  });
});

describe('unit code read as a build code', () => {
  it('gives the biosoldier build', () => {
    const code = encodeUnit({ kind: 'biosoldier', build: OFFICER_BUILD, loadout: SERAPH_LOADOUT }) ?? '';

    const result = BUILD_CODECS.biosoldier.decode(code);

    expect(result).toEqual({ status: 'decoded', build: OFFICER_BUILD });
  });

  it('gives the MEC build', () => {
    const code = encodeUnit({ kind: 'mec', build: MEC_BUILD, loadout: MEC_LOADOUT }) ?? '';

    const result = BUILD_CODECS.mec.decode(code);

    expect(result).toEqual({ status: 'decoded', build: MEC_BUILD });
  });

  it('gives the SHIV build', () => {
    const code = encodeUnit({ kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT }) ?? '';

    const result = BUILD_CODECS.shiv.decode(code);

    expect(result).toEqual({ status: 'decoded', build: SHIV_BUILD });
  });

  it('is reported as a code of another unit', () => {
    const code = encodeUnit({ kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT }) ?? '';

    const result = BUILD_CODECS.biosoldier.decode(code);

    expect(result).toEqual({ status: 'other-unit', unit: 'SHIV' });
  });
});

describe('encodeUnit', () => {
  it('writes the LOADOUT section after the build sections', () => {
    const code = encodeUnit({ kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT });

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, [...PLAIN_BUILD_SECTIONS, SERAPH_LOADOUT_SECTION]));
  });

  it('gives null for more utility slots than the section counts', () => {
    const code = encodeUnit({ kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: OVERFULL_LOADOUT });

    expect(code).toBeNull();
  });
});

describe('decodeUnit', () => {
  it('reads the LOADOUT section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [...PLAIN_BUILD_SECTIONS, SERAPH_LOADOUT_SECTION]) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit: { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT } });
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [...PLAIN_BUILD_SECTIONS, SERAPH_LOADOUT_SECTION, UNKNOWN_SECTION]) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit: { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT } });
  });

  it('leaves the slot of an unknown item code empty', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [...PLAIN_BUILD_SECTIONS, UNKNOWN_ARMOR_SECTION]) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual({ status: 'decoded', unit: { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: UNKNOWN_ARMOR_LOADOUT } });
  });

  it('gives invalid for a LOADOUT section with extra bits', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [...PLAIN_BUILD_SECTIONS, LONG_LOADOUT_SECTION]) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a cut LOADOUT section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [...PLAIN_BUILD_SECTIONS, CUT_LOADOUT_SECTION]) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid without the build sections', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [SERAPH_LOADOUT_SECTION]) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a code of no build format', () => {
    const code = encodeBinaryCode(UNKNOWN_FORMAT, [...PLAIN_BUILD_SECTIONS, SERAPH_LOADOUT_SECTION]) ?? '';

    const result = decodeUnit(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for text that is no code', () => {
    const result = decodeUnit(GARBAGE_CODE);

    expect(result).toEqual(INVALID_RESULT);
  });
});
