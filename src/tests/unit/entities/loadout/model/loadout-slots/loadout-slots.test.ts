import { describe, expect, it, vi } from 'vitest';

import { isSlotRemovable, setSlotItem, slotItemId } from '@entities/loadout/model/loadout-slots';

import { ASSAULT, createLoadoutMock, ROCKETEER } from '../loadout/loadout.mock';
import { FULL_LOADOUT, MEC_LOADOUT } from './loadout-slots.mock';

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

describe('slotItemId', () => {
  it('reads the armor slot', () => {
    const id = slotItemId(FULL_LOADOUT, { kind: 'armor' });

    expect(id).toBe('tactical-vest');
  });

  it('reads the primary slot', () => {
    const id = slotItemId(FULL_LOADOUT, { kind: 'primary' });

    expect(id).toBe('assault-rifle');
  });

  it('reads the secondary slot', () => {
    const id = slotItemId(FULL_LOADOUT, { kind: 'secondary' });

    expect(id).toBe('pistol');
  });

  it('reads a utility slot by position', () => {
    const id = slotItemId(FULL_LOADOUT, { kind: 'utility', index: 1 });

    expect(id).toBe('medikit');
  });

  it('reads a Module slot by position', () => {
    const id = slotItemId(MEC_LOADOUT, { kind: 'module', index: 0 });

    expect(id).toBe('flamethrower');
  });

  it('reads an empty slot as null', () => {
    const id = slotItemId(createLoadoutMock(), { kind: 'secondary' });

    expect(id).toBeNull();
  });

  it('reads a utility slot the Loadout does not have as null', () => {
    const id = slotItemId(FULL_LOADOUT, { kind: 'utility', index: 5 });

    expect(id).toBeNull();
  });
});

describe('setSlotItem', () => {
  it('puts a weapon in the secondary slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'secondary' }, 'pistol');

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock({ secondary: 'pistol' }) });
  });

  it('empties the secondary slot', () => {
    const loadout = createLoadoutMock({ secondary: 'pistol' });

    const isSet = setSlotItem(loadout, { kind: 'secondary' }, null);

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock() });
  });

  it('puts equipment in a utility slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'utility', index: 1 }, 'medikit');

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock({ utility: [null, 'medikit'] }) });
  });

  it('empties a utility slot', () => {
    const loadout = createLoadoutMock({ utility: [null, 'medikit'] });

    const isSet = setSlotItem(loadout, { kind: 'utility', index: 1 }, null);

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock() });
  });

  it('puts a Module in a Module slot', () => {
    const loadout = createLoadoutMock({ modules: [null] });

    const isSet = setSlotItem(loadout, { kind: 'module', index: 0 }, 'kinetic-strike-module');

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock({ modules: ['kinetic-strike-module'] }) });
  });

  it('empties a Module slot', () => {
    const loadout = createLoadoutMock({ modules: ['kinetic-strike-module'] });

    const isSet = setSlotItem(loadout, { kind: 'module', index: 0 }, null);

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock({ modules: [null] }) });
  });

  it('puts armor in the armor slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'armor' }, 'phalanx-armor');

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock({ armor: 'phalanx-armor' }) });
  });

  it('puts a SHIV type in the armor slot', () => {
    const loadout = createLoadoutMock({ armor: 'shiv', primary: 'autocannon' });

    const isSet = setSlotItem(loadout, { kind: 'armor' }, 'alloy-shiv');

    expect({ isSet, loadout }).toEqual({ isSet: true, loadout: createLoadoutMock({ armor: 'alloy-shiv', primary: 'autocannon' }) });
  });

  it('keeps equipment out of a weapon slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'secondary' }, 'medikit');

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
  });

  it('keeps a weapon out of a utility slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'utility', index: 0 }, 'pistol');

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
  });

  it('keeps a weapon out of the armor slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'armor' }, 'assault-rifle');

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
  });

  it('keeps an unknown item out', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'utility', index: 0 }, 'plasma-cannon' as never);

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
  });

  it('writes nothing to a utility slot the Loadout does not have', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'utility', index: 2 }, 'medikit');

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
  });

  it('writes nothing to a Module slot the Loadout does not have', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'module', index: 0 }, 'flamethrower');

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
  });

  it('never empties the armor slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'armor' }, null);

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
  });

  it('never empties the primary slot', () => {
    const loadout = createLoadoutMock();

    const isSet = setSlotItem(loadout, { kind: 'primary' }, null);

    expect({ isSet, loadout }).toEqual({ isSet: false, loadout: createLoadoutMock() });
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
    const isRemovable = isSlotRemovable({ kind: 'utility', index: 0 }, createLoadoutMock({ utility: ['he-grenade', null] }), ASSAULT);

    expect(isRemovable).toBe(true);
  });
});
