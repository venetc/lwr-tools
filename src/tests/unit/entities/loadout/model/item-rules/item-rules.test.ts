import { describe, expect, it, vi } from 'vitest';

import { itemRules } from '@entities/loadout/model/item-rules';

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

describe('itemRules', () => {
  it('names the items of the unit equipment does not stack with', () => {
    const rules = itemRules('chitin-plating', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', cantStackWith: [{ id: 'alloy-plating' }, { id: 'ceramic-plating' }] });
  });

  it('leaves out items of other unit types from the stack', () => {
    const rules = itemRules('drum-mags', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', cantStackWith: [] });
  });

  it('names items of the unit of another unit type from the stack', () => {
    const rules = itemRules('drum-mags', 'mec');

    expect(rules).toMatchObject({ kind: 'equipment', cantStackWith: [{ id: 'heavy-mags' }] });
  });

  it('names the weapon tiers ammo works with', () => {
    const rules = itemRules('reaper-ammo', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', primaryTiers: ['laser'], primaryTypes: null });
  });

  it('names the weapon types an item works with', () => {
    const rules = itemRules('drum-mags', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', primaryTiers: null, primaryTypes: ['assault-rifle'] });
  });

  it('names the Module an item needs', () => {
    const rules = itemRules('the-thumper', 'mec');

    expect(rules).toMatchObject({ kind: 'equipment', requiredModule: { id: 'kinetic-strike-module' } });
  });

  it('needs no Module for an item without one', () => {
    const rules = itemRules('he-grenade', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', requiredModule: null });
  });

  it('lets passive gear into Gear Slots', () => {
    const rules = itemRules('alloy-plating', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', slotKinds: ['regular', 'gear-slot'] });
  });

  it('lets passive psi gear into Gear Slots and Psi Slots', () => {
    const rules = itemRules('psi-frayer', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', slotKinds: ['regular', 'gear-slot', 'psi-slot'] });
  });

  it('keeps an active item in regular slots only', () => {
    const rules = itemRules('he-grenade', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'equipment', slotKinds: ['regular'] });
  });

  it('gives a Module no utility slots', () => {
    const rules = itemRules('flamethrower', 'mec');

    expect(rules).toMatchObject({ kind: 'equipment', slotKinds: [] });
  });

  it('counts the Gear Slots of armor', () => {
    const rules = itemRules('aegis-armor', 'biosoldier');

    expect(rules).toEqual({ kind: 'armor', gearSlots: 2, psiSlots: 0, isRiggingIgnored: false });
  });

  it('counts the Psi Slots of armor', () => {
    const rules = itemRules('aurora-armor', 'biosoldier');

    expect(rules).toEqual({ kind: 'armor', gearSlots: 0, psiSlots: 1, isRiggingIgnored: false });
  });

  it('notes that Tactical Rigging adds no slot to Phalanx', () => {
    const rules = itemRules('phalanx-armor', 'biosoldier');

    expect(rules).toMatchObject({ kind: 'armor', isRiggingIgnored: true });
  });

  it('notes no Tactical Rigging rule for a MEC exoskeleton', () => {
    const rules = itemRules('mec1-paladin', 'mec');

    expect(rules).toMatchObject({ kind: 'armor', isRiggingIgnored: false });
  });

  it('counts the utility slot an LMG takes away', () => {
    const rules = itemRules('lmg', 'biosoldier');

    expect(rules).toEqual({ kind: 'weapon', takenUtilitySlots: 1 });
  });

  it('counts no utility slots a rifle takes away', () => {
    const rules = itemRules('assault-rifle', 'biosoldier');

    expect(rules).toEqual({ kind: 'weapon', takenUtilitySlots: 0 });
  });

  it('gives a SHIV type no rules', () => {
    const rules = itemRules('alloy-shiv', 'shiv');

    expect(rules).toEqual({ kind: 'shiv-type' });
  });

  it('gives no rules for an unknown id', () => {
    const rules = itemRules('plasma-cannon' as never, 'biosoldier');

    expect(rules).toBeNull();
  });
});
