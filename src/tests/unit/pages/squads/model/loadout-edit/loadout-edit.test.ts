import { describe, expect, it, vi } from 'vitest';

import { fitLoadout, utilitySlotSources } from '@entities/loadout';
import { equipLoadoutItem, removeLoadoutItem, utilitySlotFormula } from '@pages/squads/model/loadout-edit';

import {
  AEGIS_FORMULA,
  AEGIS_SOURCES,
  ASSAULT,
  AURORA_FORMULA,
  AURORA_SOURCES,
  createLoadoutMock,
  DAUNTLESS_FIT,
  DAUNTLESS_NOTES,
  DEFENDER_FIT,
  DEFENDER_NOTES,
  GRENADE_MOVED_FIT,
  GRENADE_MOVED_NOTES,
  JAEGER,
  LASER_REPLACED_FIT,
  LASER_REPLACED_NOTES,
  LAUNCHER_ADDED_FIT,
  LAUNCHER_ADDED_NOTES,
  LMG_FORMULA,
  LMG_SOURCES,
  ONE_SLOT_FORMULA,
  ONE_SLOT_SOURCES,
  PALADIN_LOADOUT,
  REAPER_REMOVED_FIT,
  REAPER_REMOVED_NOTES,
  SHRUNK_FIT,
  SHRUNK_NOTES,
  THUMPER_REMOVED_FIT,
  THUMPER_REMOVED_NOTES,
  TITAN_FORMULA,
  TITAN_SOURCES,
  UNCHANGED_FIT,
} from './loadout-edit.mock';

vi.mock('@entities/loadout', async () => ({
  LOADOUT_UNITS: [],
  findLoadoutItem: (await import('./loadout-edit.mock')).findLoadoutItemStub,
  fitLoadout: vi.fn(),
  setSlotItem: vi.fn(),
  utilitySlotSources: vi.fn(),
}));

describe('utilitySlotFormula', () => {
  it('names the armor, Tactical Rigging and the Gear Slots', () => {
    vi.mocked(utilitySlotSources).mockReturnValue(AEGIS_SOURCES);

    const formula = utilitySlotFormula(createLoadoutMock({ armor: 'aegis-armor' }));

    expect(formula).toBe(AEGIS_FORMULA);
  });

  it('names the Psi Slot', () => {
    vi.mocked(utilitySlotSources).mockReturnValue(AURORA_SOURCES);

    const formula = utilitySlotFormula(createLoadoutMock({ armor: 'aurora-armor' }));

    expect(formula).toBe(AURORA_FORMULA);
  });

  it('subtracts the slot the primary weapon takes away', () => {
    vi.mocked(utilitySlotSources).mockReturnValue(LMG_SOURCES);

    const formula = utilitySlotFormula(createLoadoutMock({ primary: 'lmg' }));

    expect(formula).toBe(LMG_FORMULA);
  });

  it('names a single slot', () => {
    vi.mocked(utilitySlotSources).mockReturnValue(ONE_SLOT_SOURCES);

    const formula = utilitySlotFormula(createLoadoutMock({ primary: 'lmg' }));

    expect(formula).toBe(ONE_SLOT_FORMULA);
  });

  it('names the maximum of a capped count', () => {
    vi.mocked(utilitySlotSources).mockReturnValue(TITAN_SOURCES);

    const formula = utilitySlotFormula(createLoadoutMock({ armor: 'titan-armor' }));

    expect(formula).toBe(TITAN_FORMULA);
  });
});

describe('equipLoadoutItem', () => {
  it('adds no notes when the rules change nothing else', () => {
    vi.mocked(fitLoadout).mockReturnValue(UNCHANGED_FIT);

    const result = equipLoadoutItem(createLoadoutMock(), { kind: 'utility', index: 1 }, 'he-grenade', ASSAULT);

    expect(result.notes).toEqual([]);
  });

  it('tells about the new slot count and an item moved out of a Gear Slot', () => {
    vi.mocked(fitLoadout).mockReturnValue(GRENADE_MOVED_FIT);

    const result = equipLoadoutItem(createLoadoutMock({ utility: [null, null, 'he-grenade'] }), { kind: 'armor' }, 'aegis-armor', ASSAULT);

    expect(result.notes).toEqual(GRENADE_MOVED_NOTES);
  });

  it('tells about an item of a removed slot', () => {
    vi.mocked(fitLoadout).mockReturnValue(SHRUNK_FIT);

    const result = equipLoadoutItem(createLoadoutMock({ utility: [null, 'he-grenade', 'ceramic-plating'] }), { kind: 'primary' }, 'lmg', ASSAULT);

    expect(result.notes).toEqual(SHRUNK_NOTES);
  });

  it('tells about an item removed with its reason', () => {
    vi.mocked(fitLoadout).mockReturnValue(REAPER_REMOVED_FIT);

    const result = equipLoadoutItem(createLoadoutMock({ primary: 'laser-rifle', utility: ['reaper-ammo', null, null] }), { kind: 'primary' }, 'assault-rifle', ASSAULT);

    expect(result.notes).toEqual(REAPER_REMOVED_NOTES);
  });

  it('tells about a replaced item with its replacement', () => {
    vi.mocked(fitLoadout).mockReturnValue(LASER_REPLACED_FIT);

    const result = equipLoadoutItem(createLoadoutMock({ primary: 'laser-rifle' }), { kind: 'armor' }, 'tactical-vest', ASSAULT);

    expect(result.notes).toEqual(LASER_REPLACED_NOTES);
  });

  it('tells about an added item', () => {
    vi.mocked(fitLoadout).mockReturnValue(LAUNCHER_ADDED_FIT);

    const result = equipLoadoutItem(createLoadoutMock(), { kind: 'armor' }, 'tactical-vest', ASSAULT);

    expect(result.notes).toEqual(LAUNCHER_ADDED_NOTES);
  });

  it('tells about the new utility and Module slot counts of an exoskeleton', () => {
    vi.mocked(fitLoadout).mockReturnValue(DAUNTLESS_FIT);

    const result = equipLoadoutItem(PALADIN_LOADOUT, { kind: 'armor' }, 'hmec3-dauntless', JAEGER);

    expect(result.notes).toEqual(DAUNTLESS_NOTES);
  });

  it('tells about the new Module slot count alone when the utility slots stay', () => {
    vi.mocked(fitLoadout).mockReturnValue(DEFENDER_FIT);

    const result = equipLoadoutItem(PALADIN_LOADOUT, { kind: 'armor' }, 'hmec2-defender', JAEGER);

    expect(result.notes).toEqual(DEFENDER_NOTES);
  });
});

describe('removeLoadoutItem', () => {
  it('tells about an item that needed the removed Module by its name', () => {
    vi.mocked(fitLoadout).mockReturnValue(THUMPER_REMOVED_FIT);

    const result = removeLoadoutItem(createLoadoutMock({ utility: ['the-thumper', null, null], modules: ['kinetic-strike-module'] }), { kind: 'module', index: 0 }, JAEGER);

    expect(result.notes).toEqual(THUMPER_REMOVED_NOTES);
  });

  it('adds no notes when the rules change nothing else', () => {
    vi.mocked(fitLoadout).mockReturnValue(UNCHANGED_FIT);

    const result = removeLoadoutItem(createLoadoutMock({ utility: [null, 'he-grenade', 'he-grenade'] }), { kind: 'utility', index: 2 }, ASSAULT);

    expect(result.notes).toEqual([]);
  });
});
