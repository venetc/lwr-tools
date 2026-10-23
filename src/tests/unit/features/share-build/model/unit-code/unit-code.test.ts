import { describe, expect, it } from 'vitest';

import { readShareCode } from '@features/share-build/model/share-code';
import { encodeUnit } from '@features/share-build/model/unit-code';
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
  PLAIN_PERKS_SECTION,
  SERAPH_LOADOUT,
  SERAPH_LOADOUT_SECTION,
  SHIV_BUILD,
  SHIV_LOADOUT,
  UNKNOWN_ARMOR_LOADOUT,
  UNKNOWN_ARMOR_SECTION,
  UNKNOWN_FORMAT,
  UNKNOWN_SECTION,
} from './unit-code.mock';

describe('unit code round trip', () => {
  it('restores a biosoldier Unit with officer perks and its Loadout', () => {
    const unit = { kind: 'biosoldier', build: OFFICER_BUILD, loadout: SERAPH_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit });
  });

  it('restores Seraph Armor of a biosoldier Unit without officer perks', () => {
    const unit = { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit });
  });

  it('restores a MEC Unit with its Modules', () => {
    const unit = { kind: 'mec', build: MEC_BUILD, loadout: MEC_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit });
  });

  it('restores a SHIV Unit with its SHIV type', () => {
    const unit = { kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT } as const;
    const code = encodeUnit(unit) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit });
  });
});

describe('encodeUnit', () => {
  it('writes the LOADOUT section after the build sections', () => {
    const code = encodeUnit({ kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT });

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, SERAPH_LOADOUT_SECTION]));
  });

  it('gives null for more utility slots than the section counts', () => {
    const code = encodeUnit({ kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: OVERFULL_LOADOUT });

    expect(code).toBeNull();
  });
});

describe('readShareCode of a Unit code', () => {
  it('reads the LOADOUT section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, SERAPH_LOADOUT_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT } });
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, SERAPH_LOADOUT_SECTION, UNKNOWN_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: SERAPH_LOADOUT } });
  });

  it('leaves the slot of an unknown item code empty', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, UNKNOWN_ARMOR_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual({ status: 'unit', unit: { kind: 'biosoldier', build: PLAIN_BIOSOLDIER_BUILD, loadout: UNKNOWN_ARMOR_LOADOUT } });
  });

  it('gives invalid for a LOADOUT section with extra bits', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, LONG_LOADOUT_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a cut LOADOUT section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, CUT_LOADOUT_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid without the build sections', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [SERAPH_LOADOUT_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for a code of no build format', () => {
    const code = encodeBinaryCode(UNKNOWN_FORMAT, [PLAIN_PERKS_SECTION, SERAPH_LOADOUT_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives invalid for text that is no code', () => {
    const result = readShareCode(GARBAGE_CODE);

    expect(result).toEqual(INVALID_RESULT);
  });
});
