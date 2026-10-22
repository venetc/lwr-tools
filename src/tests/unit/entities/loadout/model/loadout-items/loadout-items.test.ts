import { describe, expect, it, vi } from 'vitest';

import { findLoadoutItem, slotItems } from '@entities/loadout/model/loadout-items';

import { ARMOR_IDS, EQUIPMENT_IDS, SHIV_TYPE_IDS, WEAPON_IDS } from './loadout-items.mock';

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

describe('findLoadoutItem', () => {
  it('finds armor', () => {
    const found = findLoadoutItem('phalanx-armor');

    expect(found).toMatchObject({ kind: 'armor', item: { name: 'Phalanx' } });
  });

  it('finds a SHIV type', () => {
    const found = findLoadoutItem('alloy-shiv');

    expect(found).toMatchObject({ kind: 'shiv-type', item: { name: 'Alloy SHIV' } });
  });

  it('finds a weapon', () => {
    const found = findLoadoutItem('pistol');

    expect(found).toMatchObject({ kind: 'weapon', item: { name: 'Pistol' } });
  });

  it('finds equipment', () => {
    const found = findLoadoutItem('medikit');

    expect(found).toMatchObject({ kind: 'equipment', item: { name: 'Medikit' } });
  });

  it('finds a Module', () => {
    const found = findLoadoutItem('flamethrower');

    expect(found).toMatchObject({ kind: 'equipment', item: { name: 'Flamethrower' } });
  });

  it('finds nothing for an unknown id', () => {
    const found = findLoadoutItem('plasma-cannon' as never);

    expect(found).toBeNull();
  });
});

describe('slotItems', () => {
  it('gives a biosoldier armor slot the armor catalog', () => {
    const items = slotItems({ kind: 'armor' }, 'biosoldier');

    expect(items.map(found => found.item.id)).toEqual(ARMOR_IDS);
  });

  it('gives a MEC armor slot the armor catalog', () => {
    const items = slotItems({ kind: 'armor' }, 'mec');

    expect(items.map(found => found.item.id)).toEqual(ARMOR_IDS);
  });

  it('gives a SHIV armor slot the SHIV types', () => {
    const items = slotItems({ kind: 'armor' }, 'shiv');

    expect(items.map(found => found.item.id)).toEqual(SHIV_TYPE_IDS);
  });

  it('gives the primary slot the weapons', () => {
    const items = slotItems({ kind: 'primary' }, 'biosoldier');

    expect(items.map(found => found.item.id)).toEqual(WEAPON_IDS);
  });

  it('gives the secondary slot the weapons', () => {
    const items = slotItems({ kind: 'secondary' }, 'biosoldier');

    expect(items.map(found => found.item.id)).toEqual(WEAPON_IDS);
  });

  it('gives a utility slot the equipment', () => {
    const items = slotItems({ kind: 'utility', index: 0 }, 'shiv');

    expect(items.map(found => found.item.id)).toEqual(EQUIPMENT_IDS);
  });

  it('gives a Module slot the equipment', () => {
    const items = slotItems({ kind: 'module', index: 0 }, 'mec');

    expect(items.map(found => found.item.id)).toEqual(EQUIPMENT_IDS);
  });
});
