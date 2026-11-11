import { describe, expect, it, vi } from 'vitest';

import { slotItemId, slotItems } from '@entities/loadout';
import { itemDetails, lockerContents } from '@pages/squads/model/loadout-locker';

import {
  AEGIS_RULES,
  ALLOY_SUMMARY,
  ARC_RIFLE_TYPE,
  ARMOR_GROUP_TITLES,
  ARMOR_LOCKER_IDS,
  ARMOR_SLOT_ITEMS,
  ASSAULT,
  BLOCKED_ARC_IDS,
  BLOCKED_ARMOR_ITEMS,
  BLOCKED_ROWS,
  CERAMIC_REASON,
  CHITIN_REASONS,
  CHITIN_RULES,
  FIT_ARC_IDS,
  FIT_ROW_NAMES,
  FITTING_UTILITY_ITEMS,
  FITTING_UTILITY_TITLES,
  FRAYER_RULES,
  GHOST_LABEL,
  GRENADE_RULES,
  LMG_CELL_IDS,
  LMG_RULES,
  LOADOUT,
  MATRIX_GROUP_TITLES,
  MATRIX_SLOT_ITEMS,
  MATRIX_TIERS,
  MATRIX_WITHOUT_ARC_ITEMS,
  MATRIX_WITHOUT_ARC_TITLES,
  MODULE_SLOT_ITEMS,
  NO_TIER_IDS,
  PASSIVE_AND_BLOCKED_ITEMS,
  PASSIVE_AND_BLOCKED_TITLES,
  PHALANX_RULES,
  REAPER_RULES,
  RIFLE_STATS,
  RIFLE_TYPE,
  SCANNER_REASON,
  SHIV_SLOT_ITEMS,
  THUMPER_REASON,
  THUMPER_RULES,
  UNAVAILABLE_TITLES,
  UNAVAILABLE_UTILITY_IDS,
  UNTITLED,
  UTILITY_GROUP_TITLES,
  UTILITY_LOCKER_IDS,
  UTILITY_SLOT_ITEMS,
  VEST_LABEL,
  VEST_STATS,
  WEAPON_GROUP_TITLES,
  WEAPON_SLOT_ITEMS,
} from './loadout-locker.mock';

vi.mock('@entities/loadout', async () => {
  const mock = await import('./loadout-locker.mock');

  return {
    LOADOUT_UNITS: [],
    WEAPON_TIERS: mock.WEAPON_TIERS_MOCK,
    blockReasons: mock.blockReasonsStub,
    findLoadoutItem: mock.findLoadoutItemStub,
    itemCarriers: vi.fn(),
    itemRules: mock.itemRulesStub,
    slotItemId: vi.fn(),
    slotItems: vi.fn(),
  };
});

describe('lockerContents', () => {
  it('lists items that fit first, then the rest in catalog order, and leaves out items of other unit types', () => {
    vi.mocked(slotItems).mockReturnValue(ARMOR_SLOT_ITEMS);

    const items = lockerContents({ kind: 'armor' }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.map(item => item.id)).toEqual(ARMOR_LOCKER_IDS);
  });

  it('keeps the catalog order within each group', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.map(item => item.id)).toEqual(UTILITY_LOCKER_IDS);
  });

  it('marks the item in the slot as equipped', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);
    vi.mocked(slotItemId).mockReturnValue('alloy-plating');

    const items = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.filter(item => item.isEquipped).map(item => item.id)).toEqual(['alloy-plating']);
  });

  it('names the item with its first reason', () => {
    vi.mocked(slotItems).mockReturnValue(ARMOR_SLOT_ITEMS);

    const items = lockerContents({ kind: 'armor' }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.find(item => item.id === 'ghost-armor')?.label).toBe(GHOST_LABEL);
  });

  it('names the equipped item with its mark', () => {
    vi.mocked(slotItems).mockReturnValue(ARMOR_SLOT_ITEMS);
    vi.mocked(slotItemId).mockReturnValue('tactical-vest');

    const items = lockerContents({ kind: 'armor' }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.find(item => item.id === 'tactical-vest')?.label).toBe(VEST_LABEL);
  });

  it('labels an item of another class', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.find(item => item.id === 'battle-scanner')?.reasonLabel).toBe(SCANNER_REASON);
  });

  it('labels an item that does not stack', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerContents({ kind: 'utility', index: 1 }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.find(item => item.id === 'ceramic-plating')?.reasonLabel).toBe(CERAMIC_REASON);
  });

  it('names the Module an item needs', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

    expect(items.find(item => item.id === 'the-thumper')?.reasonLabel).toBe(THUMPER_REASON);
  });

  it('groups armor by category in catalog order, then the armor that does not fit', () => {
    vi.mocked(slotItems).mockReturnValue(ARMOR_SLOT_ITEMS);

    const groups = lockerContents({ kind: 'armor' }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(ARMOR_GROUP_TITLES);
  });

  it('groups utility items into active and passive ones, then those that do not fit', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const groups = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(UTILITY_GROUP_TITLES);
  });

  it('keeps the items that do not fit in one last group in catalog order', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const groups = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups;

    expect(groups.at(-1)?.items.map(item => item.id)).toEqual(UNAVAILABLE_UTILITY_IDS);
  });

  it('groups weapons of one tier by their tier, then those without a tier', () => {
    vi.mocked(slotItems).mockReturnValue(WEAPON_SLOT_ITEMS);

    const groups = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(WEAPON_GROUP_TITLES);
  });

  it('lists weapons of one tier without a matrix', () => {
    vi.mocked(slotItems).mockReturnValue(WEAPON_SLOT_ITEMS);

    const contents = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(contents.tiers).toEqual([]);
  });

  it('makes a column of every tier of the Locker, in tier order', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_SLOT_ITEMS);

    const contents = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(contents.tiers).toEqual(MATRIX_TIERS);
  });

  it('makes a row of every weapon type that fits, in catalog order, and keeps a type with some weapons that fit', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_SLOT_ITEMS);

    const { groups } = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(groups[0]?.rows.map(row => row.name)).toEqual(FIT_ROW_NAMES);
  });

  it('leaves a cell empty where the type has no weapon of the tier', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_SLOT_ITEMS);

    const { groups } = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(groups[0]?.rows[0]?.cells.map(cell => cell?.id ?? null)).toEqual(LMG_CELL_IDS);
  });

  it('moves a type with no weapon that fits to the last group with the first reason of its first weapon', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_SLOT_ITEMS);

    const { groups } = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(groups.at(-1)?.rows.map(row => ({ name: row.name, reason: row.reason }))).toEqual(BLOCKED_ROWS);
  });

  it('lists the Arc weapons that fit under no tier', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_SLOT_ITEMS);

    const { groups } = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(groups[1]?.items.map(item => item.id)).toEqual(FIT_ARC_IDS);
  });

  it('lists the Arc weapons that do not fit after the rows of the last group', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_SLOT_ITEMS);

    const { groups } = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(groups.at(-1)?.items.map(item => item.id)).toEqual(BLOCKED_ARC_IDS);
  });

  it('puts the matrix rows that fit first, then the Arc weapons, then what does not fit', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_SLOT_ITEMS);

    const { groups } = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(groups.map(group => group.title)).toEqual(MATRIX_GROUP_TITLES);
  });

  it('leaves out a matrix group without rows or items', () => {
    vi.mocked(slotItems).mockReturnValue(MATRIX_WITHOUT_ARC_ITEMS);

    const { groups } = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT);

    expect(groups.map(group => group.title)).toEqual(MATRIX_WITHOUT_ARC_TITLES);
  });

  it('lists an Arc weapon under no tier', () => {
    vi.mocked(slotItems).mockReturnValue(WEAPON_SLOT_ITEMS);

    const groups = lockerContents({ kind: 'primary' }, LOADOUT, ASSAULT).groups;

    expect(groups.at(-1)?.items.map(item => item.id)).toEqual(NO_TIER_IDS);
  });

  it('leaves out a group without items', () => {
    vi.mocked(slotItems).mockReturnValue(PASSIVE_AND_BLOCKED_ITEMS);

    const groups = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(PASSIVE_AND_BLOCKED_TITLES);
  });

  it('adds no group of items that do not fit when every item fits', () => {
    vi.mocked(slotItems).mockReturnValue(FITTING_UTILITY_ITEMS);

    const groups = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(FITTING_UTILITY_TITLES);
  });

  it('lists only the group of items that do not fit when none fits', () => {
    vi.mocked(slotItems).mockReturnValue(BLOCKED_ARMOR_ITEMS);

    const groups = lockerContents({ kind: 'armor' }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(UNAVAILABLE_TITLES);
  });

  it('lists Modules without a group name', () => {
    vi.mocked(slotItems).mockReturnValue(MODULE_SLOT_ITEMS);

    const groups = lockerContents({ kind: 'module', index: 0 }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(UNTITLED);
  });

  it('lists SHIV types without a group name', () => {
    vi.mocked(slotItems).mockReturnValue(SHIV_SLOT_ITEMS);

    const groups = lockerContents({ kind: 'armor' }, LOADOUT, ASSAULT).groups;

    expect(groups.map(group => group.title)).toEqual(UNTITLED);
  });

  it('sums up the stats in one line', () => {
    vi.mocked(slotItems).mockReturnValue(UTILITY_SLOT_ITEMS);

    const items = lockerContents({ kind: 'utility', index: 0 }, LOADOUT, ASSAULT).groups.flatMap(group => group.items);

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

  it('names the type of a weapon without a tier alone', () => {
    const details = itemDetails('arc-rifle', { kind: 'primary' }, LOADOUT, ASSAULT);

    expect(details?.type).toBe(ARC_RIFLE_TYPE);
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
