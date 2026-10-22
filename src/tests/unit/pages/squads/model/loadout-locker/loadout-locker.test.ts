import { describe, expect, it, vi } from 'vitest';

import { slotItemId, slotItems } from '@entities/loadout';
import { itemDetails, lockerItems } from '@pages/squads/model/loadout-locker';

import {
  AEGIS_RULES,
  ALLOY_SUMMARY,
  ARMOR_LOCKER_IDS,
  ARMOR_SLOT_ITEMS,
  ASSAULT,
  CERAMIC_REASON,
  CHITIN_REASONS,
  CHITIN_RULES,
  FRAYER_RULES,
  GHOST_LABEL,
  GRENADE_RULES,
  LMG_RULES,
  LOADOUT,
  PHALANX_RULES,
  REAPER_RULES,
  RIFLE_STATS,
  RIFLE_TYPE,
  SCANNER_REASON,
  THUMPER_REASON,
  THUMPER_RULES,
  UTILITY_LOCKER_IDS,
  UTILITY_SLOT_ITEMS,
  VEST_LABEL,
  VEST_STATS,
} from './loadout-locker.mock';

vi.mock('@entities/loadout', async () => {
  const mock = await import('./loadout-locker.mock');

  return {
    LOADOUT_UNITS: [],
    blockReasons: mock.blockReasonsStub,
    findLoadoutItem: mock.findLoadoutItemStub,
    itemCarriers: vi.fn(),
    itemRules: mock.itemRulesStub,
    slotItemId: vi.fn(),
    slotItems: vi.fn(),
  };
});

describe('lockerItems', () => {
  it('lists items that fit first, then the rest in catalog order, and leaves out items of other unit types', () => {
    vi.mocked(slotItems).mockReturnValue(ARMOR_SLOT_ITEMS);

    const items = lockerItems({ kind: 'armor' }, LOADOUT, ASSAULT);

    expect(items.map(item => item.id)).toEqual(ARMOR_LOCKER_IDS);
  });

  it('keeps the catalog order within each group', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerItems({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(items.map(item => item.id)).toEqual(UTILITY_LOCKER_IDS);
  });

  it('marks the item in the slot as equipped', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);
    vi.mocked(slotItemId).mockReturnValue('alloy-plating');

    const items = lockerItems({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(items.filter(item => item.isEquipped).map(item => item.id)).toEqual(['alloy-plating']);
  });

  it('names the item with its first reason', () => {
    vi.mocked(slotItems).mockReturnValue(ARMOR_SLOT_ITEMS);

    const items = lockerItems({ kind: 'armor' }, LOADOUT, ASSAULT);

    expect(items.find(item => item.id === 'ghost-armor')?.label).toBe(GHOST_LABEL);
  });

  it('names the equipped item with its mark', () => {
    vi.mocked(slotItems).mockReturnValue(ARMOR_SLOT_ITEMS);
    vi.mocked(slotItemId).mockReturnValue('tactical-vest');

    const items = lockerItems({ kind: 'armor' }, LOADOUT, ASSAULT);

    expect(items.find(item => item.id === 'tactical-vest')?.label).toBe(VEST_LABEL);
  });

  it('labels an item of another class', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerItems({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(items.find(item => item.id === 'battle-scanner')?.reasonLabel).toBe(SCANNER_REASON);
  });

  it('labels an item that does not stack', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerItems({ kind: 'utility', index: 1 }, LOADOUT, ASSAULT);

    expect(items.find(item => item.id === 'ceramic-plating')?.reasonLabel).toBe(CERAMIC_REASON);
  });

  it('names the Module an item needs', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerItems({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(items.find(item => item.id === 'the-thumper')?.reasonLabel).toBe(THUMPER_REASON);
  });

  it('sums up the stats in one line', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerItems({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(items.find(item => item.id === 'alloy-plating')?.summary).toBe(ALLOY_SUMMARY);
  });
});

describe('itemDetails', () => {
  it('lists every reason', () => {
    const details = itemDetails('chitin-plating', { kind: 'utility', index: 1 }, LOADOUT, ASSAULT);

    expect(details?.reasons).toEqual(CHITIN_REASONS);
  });

  it('names the items equipment does not stack with and the slots that take it', () => {
    const details = itemDetails('chitin-plating', { kind: 'utility', index: 1 }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(CHITIN_RULES);
  });

  it('names the weapon tiers and types equipment works with', () => {
    const details = itemDetails('reaper-ammo', { kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(REAPER_RULES);
  });

  it('names the Module equipment needs', () => {
    const details = itemDetails('the-thumper', { kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(THUMPER_RULES);
  });

  it('keeps an active item out of Gear Slots', () => {
    const details = itemDetails('he-grenade', { kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(GRENADE_RULES);
  });

  it('lets passive psi gear into Psi Slots', () => {
    const details = itemDetails('psi-frayer', { kind: 'utility', index: 0 }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(FRAYER_RULES);
  });

  it('names no utility slots for a Module', () => {
    const details = itemDetails('kinetic-strike-module', { kind: 'module', index: 0 }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual([]);
  });

  it('lists the stats of a weapon', () => {
    const details = itemDetails('assault-rifle', { kind: 'primary' }, LOADOUT, ASSAULT);

    expect(details?.stats).toEqual(RIFLE_STATS);
  });

  it('names the type of a weapon', () => {
    const details = itemDetails('assault-rifle', { kind: 'primary' }, LOADOUT, ASSAULT);

    expect(details?.type).toBe(RIFLE_TYPE);
  });

  it('notes the slot a weapon takes away', () => {
    const details = itemDetails('lmg', { kind: 'primary' }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(LMG_RULES);
  });

  it('lists the stats of armor', () => {
    const details = itemDetails('tactical-vest', { kind: 'armor' }, LOADOUT, ASSAULT);

    expect(details?.stats).toEqual(VEST_STATS);
  });

  it('names the Gear Slots of armor', () => {
    const details = itemDetails('aegis-armor', { kind: 'armor' }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(AEGIS_RULES);
  });

  it('notes armor Tactical Rigging adds no slot to', () => {
    const details = itemDetails('phalanx-armor', { kind: 'armor' }, LOADOUT, ASSAULT);

    expect(details?.rules).toEqual(PHALANX_RULES);
  });

  it('gives no details for an unknown id', () => {
    const details = itemDetails('plasma-cannon' as never, { kind: 'primary' }, LOADOUT, ASSAULT);

    expect(details).toBeNull();
  });
});
