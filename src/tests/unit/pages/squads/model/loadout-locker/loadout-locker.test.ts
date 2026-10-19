import { describe, expect, it, vi } from 'vitest';

import { itemDetails, lockerItems } from '@pages/squads/model/loadout-locker';

import {
  AEGIS_RULES,
  ALLOY_ON,
  ALLOY_SUMMARY,
  ARMOR_LOCKER_IDS,
  ASSAULT,
  CERAMIC_REASON,
  CHITIN_REASONS,
  CHITIN_RULES,
  createLoadoutMock,
  FRAYER_RULES,
  GHOST_LABEL,
  GRENADE_RULES,
  LMG_RULES,
  MEC,
  MEC_LOADOUT,
  PHALANX_RULES,
  REAPER_RULES,
  RIFLE_STATS,
  RIFLE_TYPE,
  SCANNER_CARRIERS,
  SCANNER_REASON,
  THUMPER_REASON,
  UTILITY_LOCKER_IDS,
  VEST_LABEL,
  VEST_STATS,
} from './loadout-locker.mock';

vi.mock('@entities/loadout/config/constants/armor-content', async () => ({
  ARMOR_CONTENT: (await import('./loadout-locker.mock')).ARMOR_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/weapon-content', async () => ({
  WEAPON_CONTENT: (await import('./loadout-locker.mock')).WEAPON_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/equipment-content', async () => ({
  EQUIPMENT_CONTENT: (await import('./loadout-locker.mock')).EQUIPMENT_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/shiv-type-content', async () => ({
  SHIV_TYPE_CONTENT: (await import('./loadout-locker.mock')).SHIV_TYPE_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/armor-icons', () => ({ ARMOR_ICON: {} }));

vi.mock('@entities/loadout/config/constants/weapon-icons', () => ({ WEAPON_ICON: {} }));

vi.mock('@entities/loadout/config/constants/equipment-icons', () => ({ EQUIPMENT_ICON: {} }));

vi.mock('@entities/loadout/config/constants/shiv-type-icons', () => ({ SHIV_TYPE_ICON: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-content', () => ({ LOADOUT_ABILITY_CONTENT: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-icons', () => ({ LOADOUT_ABILITY_ICON: {} }));

describe('lockerItems', () => {
  it('lists armor that fits first and leaves out armor of other unit types', () => {
    const items = lockerItems({ kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(items.map(item => item.id)).toEqual(ARMOR_LOCKER_IDS);
  });

  it('lists equipment that fits first, then the rest in catalog order', () => {
    const items = lockerItems({ kind: 'utility', index: 0 }, ALLOY_ON, ASSAULT);

    expect(items.map(item => item.id)).toEqual(UTILITY_LOCKER_IDS);
  });

  it('marks the item in the slot as equipped', () => {
    const items = lockerItems({ kind: 'utility', index: 0 }, ALLOY_ON, ASSAULT);

    expect(items.filter(item => item.isEquipped).map(item => item.id)).toEqual(['alloy-plating']);
  });

  it('names the item with its first reason', () => {
    const items = lockerItems({ kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(items.find(item => item.id === 'ghost-armor')?.label).toBe(GHOST_LABEL);
  });

  it('names the equipped item with its mark', () => {
    const items = lockerItems({ kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(items.find(item => item.id === 'tactical-vest')?.label).toBe(VEST_LABEL);
  });

  it('labels an item of another class', () => {
    const items = lockerItems({ kind: 'utility', index: 0 }, ALLOY_ON, ASSAULT);

    expect(items.find(item => item.id === 'battle-scanner')?.reasonLabel).toBe(SCANNER_REASON);
  });

  it('labels a second plating', () => {
    const items = lockerItems({ kind: 'utility', index: 1 }, ALLOY_ON, ASSAULT);

    expect(items.find(item => item.id === 'ceramic-plating')?.reasonLabel).toBe(CERAMIC_REASON);
  });

  it('names the Module an item needs', () => {
    const items = lockerItems({ kind: 'utility', index: 0 }, MEC_LOADOUT, MEC);

    expect(items.find(item => item.id === 'the-thumper')?.reasonLabel).toBe(THUMPER_REASON);
  });

  it('sums up the stats in one line', () => {
    const items = lockerItems({ kind: 'utility', index: 0 }, ALLOY_ON, ASSAULT);

    expect(items.find(item => item.id === 'alloy-plating')?.summary).toBe(ALLOY_SUMMARY);
  });
});

describe('itemDetails', () => {
  it('lists every reason', () => {
    const details = itemDetails('chitin-plating', { kind: 'utility', index: 1 }, ALLOY_ON, ASSAULT);

    expect(details?.reasons).toEqual(CHITIN_REASONS);
  });

  it('names the items a plating does not stack with and the slots that take it', () => {
    const details = itemDetails('chitin-plating', { kind: 'utility', index: 1 }, ALLOY_ON, ASSAULT);

    expect(details?.rules).toEqual(CHITIN_RULES);
  });

  it('names the weapon tiers ammo works with', () => {
    const details = itemDetails('reaper-ammo', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(details?.rules).toEqual(REAPER_RULES);
  });

  it('keeps an active item out of Gear Slots', () => {
    const details = itemDetails('he-grenade', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(details?.rules).toEqual(GRENADE_RULES);
  });

  it('lets passive psi gear into Psi Slots', () => {
    const details = itemDetails('psi-frayer', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(details?.rules).toEqual(FRAYER_RULES);
  });

  it('names the carriers of a class item', () => {
    const details = itemDetails('battle-scanner', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(details?.carriers).toBe(SCANNER_CARRIERS);
  });

  it('lists the stats of a weapon', () => {
    const details = itemDetails('assault-rifle', { kind: 'primary' }, createLoadoutMock(), ASSAULT);

    expect(details?.stats).toEqual(RIFLE_STATS);
  });

  it('names the type of a weapon', () => {
    const details = itemDetails('assault-rifle', { kind: 'primary' }, createLoadoutMock(), ASSAULT);

    expect(details?.type).toBe(RIFLE_TYPE);
  });

  it('notes the slot an LMG takes away', () => {
    const details = itemDetails('lmg', { kind: 'primary' }, createLoadoutMock(), ASSAULT);

    expect(details?.rules).toEqual(LMG_RULES);
  });

  it('lists the stats of armor', () => {
    const details = itemDetails('tactical-vest', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(details?.stats).toEqual(VEST_STATS);
  });

  it('names the Gear Slots of armor', () => {
    const details = itemDetails('aegis-armor', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(details?.rules).toEqual(AEGIS_RULES);
  });

  it('notes armor Tactical Rigging adds no slot to', () => {
    const details = itemDetails('phalanx-armor', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(details?.rules).toEqual(PHALANX_RULES);
  });
});
