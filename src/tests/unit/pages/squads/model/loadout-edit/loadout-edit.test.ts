import { describe, expect, it, vi } from 'vitest';

import { completeLoadout, equipLoadoutItem, isSlotRemovable, removeLoadoutItem, utilitySlotFormula } from '@pages/squads/model/loadout-edit';

import {
  AEGIS_FORMULA,
  ASSAULT,
  AURORA_FORMULA,
  CERAMIC_IN_LAST_SLOT,
  createLoadoutMock,
  GRENADE_IN_LAST_SLOT,
  GRENADE_MOVED_NOTES,
  LMG_FORMULA,
  MEC,
  REAPER_ON_LASER,
  REAPER_REMOVED_NOTES,
  ROCKETEER,
  SHRUNK_NOTES,
  THUMPER_MEC,
  THUMPER_REMOVED_NOTES,
  TITAN_FORMULA,
  UNKNOWN_ARMOR_LOADOUT,
} from './loadout-edit.mock';

vi.mock('@entities/loadout/config/constants/armor-content', async () => ({
  ARMOR_CONTENT: (await import('./loadout-edit.mock')).ARMOR_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/weapon-content', async () => ({
  WEAPON_CONTENT: (await import('./loadout-edit.mock')).WEAPON_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/equipment-content', async () => ({
  EQUIPMENT_CONTENT: (await import('./loadout-edit.mock')).EQUIPMENT_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/shiv-type-content', async () => ({
  SHIV_TYPE_CONTENT: (await import('./loadout-edit.mock')).SHIV_TYPE_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/armor-icons', () => ({ ARMOR_ICON: {} }));

vi.mock('@entities/loadout/config/constants/weapon-icons', () => ({ WEAPON_ICON: {} }));

vi.mock('@entities/loadout/config/constants/equipment-icons', () => ({ EQUIPMENT_ICON: {} }));

vi.mock('@entities/loadout/config/constants/shiv-type-icons', () => ({ SHIV_TYPE_ICON: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-content', () => ({ LOADOUT_ABILITY_CONTENT: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-icons', () => ({ LOADOUT_ABILITY_ICON: {} }));

describe('utilitySlotFormula', () => {
  it('names the armor, Tactical Rigging and the Gear Slots', () => {
    const formula = utilitySlotFormula(createLoadoutMock({ armor: 'aegis-armor' }), ASSAULT);

    expect(formula).toBe(AEGIS_FORMULA);
  });

  it('names the Psi Slot', () => {
    const formula = utilitySlotFormula(createLoadoutMock({ armor: 'aurora-armor' }), ASSAULT);

    expect(formula).toBe(AURORA_FORMULA);
  });

  it('subtracts the slot an LMG takes away', () => {
    const formula = utilitySlotFormula(createLoadoutMock({ primary: 'lmg' }), ASSAULT);

    expect(formula).toBe(LMG_FORMULA);
  });

  it('names the maximum a sum above it reaches', () => {
    const formula = utilitySlotFormula(createLoadoutMock({ armor: 'titan-armor' }), ASSAULT);

    expect(formula).toBe(TITAN_FORMULA);
  });
});

describe('equipLoadoutItem', () => {
  it('puts equipment in its utility slot', () => {
    const result = equipLoadoutItem(createLoadoutMock(), { kind: 'utility', index: 1 }, 'he-grenade', ASSAULT);

    expect(result.loadout.utility).toEqual([null, 'he-grenade', null]);
  });

  it('adds no notes for equipment', () => {
    const result = equipLoadoutItem(createLoadoutMock(), { kind: 'utility', index: 1 }, 'he-grenade', ASSAULT);

    expect(result.notes).toEqual([]);
  });

  it('leaves the Loadout it got untouched', () => {
    const loadout = createLoadoutMock();

    equipLoadoutItem(loadout, { kind: 'utility', index: 1 }, 'he-grenade', ASSAULT);

    expect(loadout.utility).toEqual([null, null, null]);
  });

  it('tells about the new slot count and an item moved out of a Gear Slot', () => {
    const result = equipLoadoutItem(GRENADE_IN_LAST_SLOT, { kind: 'armor' }, 'aegis-armor', ASSAULT);

    expect(result.notes).toEqual(GRENADE_MOVED_NOTES);
  });

  it('tells about an item of a slot an LMG takes away', () => {
    const result = equipLoadoutItem(CERAMIC_IN_LAST_SLOT, { kind: 'primary' }, 'lmg', ASSAULT);

    expect(result.notes).toEqual(SHRUNK_NOTES);
  });

  it('cuts the slot an LMG takes away', () => {
    const result = equipLoadoutItem(CERAMIC_IN_LAST_SLOT, { kind: 'primary' }, 'lmg', ASSAULT);

    expect(result.loadout.utility).toEqual([null, 'he-grenade']);
  });

  it('tells about ammo removed with the weapon tier it needs', () => {
    const result = equipLoadoutItem(REAPER_ON_LASER, { kind: 'primary' }, 'assault-rifle', ASSAULT);

    expect(result.notes).toEqual(REAPER_REMOVED_NOTES);
  });
});

describe('removeLoadoutItem', () => {
  it('empties a utility slot', () => {
    const result = removeLoadoutItem(createLoadoutMock({ utility: ['he-grenade', null, null] }), { kind: 'utility', index: 0 }, ASSAULT);

    expect(result.loadout.utility).toEqual([null, null, null]);
  });

  it('empties the secondary slot', () => {
    const result = removeLoadoutItem(createLoadoutMock({ secondary: 'pistol' }), { kind: 'secondary' }, ASSAULT);

    expect(result.loadout.secondary).toBeNull();
  });

  it('takes off an item that needs the removed Module', () => {
    const result = removeLoadoutItem(THUMPER_MEC, { kind: 'module', index: 0 }, MEC);

    expect(result.notes).toEqual(THUMPER_REMOVED_NOTES);
  });

  it('keeps the armor', () => {
    const result = removeLoadoutItem(createLoadoutMock(), { kind: 'armor' }, ASSAULT);

    expect(result.loadout.armor).toBe('tactical-vest');
  });
});

describe('isSlotRemovable', () => {
  it('keeps armor on', () => {
    const isRemovable = isSlotRemovable({ kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(isRemovable).toBe(false);
  });

  it('keeps the primary weapon on', () => {
    const isRemovable = isSlotRemovable({ kind: 'primary' }, createLoadoutMock(), ASSAULT);

    expect(isRemovable).toBe(false);
  });

  it('takes a pistol off', () => {
    const isRemovable = isSlotRemovable({ kind: 'secondary' }, createLoadoutMock({ secondary: 'pistol' }), ASSAULT);

    expect(isRemovable).toBe(true);
  });

  it('keeps the rocket launcher of a Rocketeer on', () => {
    const isRemovable = isSlotRemovable({ kind: 'secondary' }, createLoadoutMock({ secondary: 'rocket-launcher' }), ROCKETEER);

    expect(isRemovable).toBe(false);
  });

  it('takes utility equipment off', () => {
    const isRemovable = isSlotRemovable({ kind: 'utility', index: 0 }, createLoadoutMock({ utility: ['he-grenade', null, null] }), ASSAULT);

    expect(isRemovable).toBe(true);
  });
});

describe('completeLoadout', () => {
  it('puts the default armor in place of an unknown one', () => {
    const loadout = completeLoadout(UNKNOWN_ARMOR_LOADOUT, ASSAULT);

    expect(loadout?.armor).toBe('tactical-vest');
  });

  it('keeps a known primary weapon', () => {
    const loadout = completeLoadout(UNKNOWN_ARMOR_LOADOUT, ASSAULT);

    expect(loadout?.primary).toBe('laser-rifle');
  });
});
