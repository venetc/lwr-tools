import { describe, expect, it, vi } from 'vitest';

import { loadoutCodes, loadoutFromCodes } from '@entities/loadout/model/loadout-codes';

import { createLoadoutMock } from '../loadout/loadout.mock';
import {
  BIOSOLDIER_CODES,
  BIOSOLDIER_LOADOUT,
  MEC_CODES,
  MEC_LOADOUT,
  SHIV_CODES,
  SHIV_LOADOUT,
  UNKNOWN_CODES,
  UNKNOWN_CODES_LOADOUT,
} from './loadout-codes.mock';

vi.mock('@entities/loadout/config/constants/armor-content', async () => ({
  ARMOR_CONTENT: (await import('../loadout/loadout.mock')).ARMOR_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/weapon-content', async () => ({
  WEAPON_CONTENT: (await import('../loadout/loadout.mock')).WEAPON_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/equipment-content', async () => ({
  EQUIPMENT_CONTENT: (await import('../loadout/loadout.mock')).EQUIPMENT_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/shiv-type-content', async () => ({
  SHIV_TYPE_CONTENT: (await import('../loadout/loadout.mock')).SHIV_TYPE_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/armor-icons', () => ({ ARMOR_ICON: {} }));

vi.mock('@entities/loadout/config/constants/weapon-icons', () => ({ WEAPON_ICON: {} }));

vi.mock('@entities/loadout/config/constants/equipment-icons', () => ({ EQUIPMENT_ICON: {} }));

vi.mock('@entities/loadout/config/constants/shiv-type-icons', () => ({ SHIV_TYPE_ICON: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-content', () => ({ LOADOUT_ABILITY_CONTENT: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-icons', () => ({ LOADOUT_ABILITY_ICON: {} }));

describe('loadoutCodes', () => {
  it('gives the codes of a biosoldier Loadout', () => {
    const codes = loadoutCodes(BIOSOLDIER_LOADOUT, 'biosoldier');

    expect(codes).toEqual(BIOSOLDIER_CODES);
  });

  it('gives the codes of a MEC Loadout with its Modules', () => {
    const codes = loadoutCodes(MEC_LOADOUT, 'mec');

    expect(codes).toEqual(MEC_CODES);
  });

  it('gives the SHIV type code in the armor slot of a SHIV', () => {
    const codes = loadoutCodes(SHIV_LOADOUT, 'shiv');

    expect(codes).toEqual(SHIV_CODES);
  });

  it('gives no code for armor of another catalog than the slot of the unit', () => {
    const codes = loadoutCodes(SHIV_LOADOUT, 'biosoldier');

    expect(codes.armor).toBeNull();
  });

  it('gives no code for an empty armor slot', () => {
    const codes = loadoutCodes({ ...createLoadoutMock(), armor: null }, 'biosoldier');

    expect(codes.armor).toBeNull();
  });
});

describe('loadoutFromCodes', () => {
  it('restores a biosoldier Loadout', () => {
    const loadout = loadoutFromCodes(BIOSOLDIER_CODES, 'biosoldier');

    expect(loadout).toEqual(BIOSOLDIER_LOADOUT);
  });

  it('restores a MEC Loadout with its Modules', () => {
    const loadout = loadoutFromCodes(MEC_CODES, 'mec');

    expect(loadout).toEqual(MEC_LOADOUT);
  });

  it('reads the armor code of a SHIV as a SHIV type', () => {
    const loadout = loadoutFromCodes(SHIV_CODES, 'shiv');

    expect(loadout).toEqual(SHIV_LOADOUT);
  });

  it('leaves the slots of unknown codes empty', () => {
    const loadout = loadoutFromCodes(UNKNOWN_CODES, 'biosoldier');

    expect(loadout).toEqual(UNKNOWN_CODES_LOADOUT);
  });

  it('keeps a biosoldier Loadout through its codes', () => {
    const loadout = loadoutFromCodes(loadoutCodes(BIOSOLDIER_LOADOUT, 'biosoldier'), 'biosoldier');

    expect(loadout).toEqual(BIOSOLDIER_LOADOUT);
  });

  it('keeps a MEC Loadout through its codes', () => {
    const loadout = loadoutFromCodes(loadoutCodes(MEC_LOADOUT, 'mec'), 'mec');

    expect(loadout).toEqual(MEC_LOADOUT);
  });

  it('keeps a SHIV Loadout through its codes', () => {
    const loadout = loadoutFromCodes(loadoutCodes(SHIV_LOADOUT, 'shiv'), 'shiv');

    expect(loadout).toEqual(SHIV_LOADOUT);
  });
});
