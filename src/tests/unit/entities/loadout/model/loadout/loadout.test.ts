import { describe, expect, it, vi } from 'vitest';

import { blockReasons, defaultLoadout, loadoutSlots, utilitySlotSources } from '@entities/loadout/model/loadout';

import { ASSAULT, createLoadoutMock, GENE_MODDED, GUNNER, MEC, OFFICER, PSIONIC, ROCKETEER, SCOUT, SHIV } from './loadout.mock';

vi.mock('@entities/loadout/config/constants/armor-content', async () => ({
  ARMOR_CONTENT: (await import('./loadout.mock')).ARMOR_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/weapon-content', async () => ({
  WEAPON_CONTENT: (await import('./loadout.mock')).WEAPON_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/equipment-content', async () => ({
  EQUIPMENT_CONTENT: (await import('./loadout.mock')).EQUIPMENT_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/shiv-type-content', async () => ({
  SHIV_TYPE_CONTENT: (await import('./loadout.mock')).SHIV_TYPE_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/armor-icons', () => ({ ARMOR_ICON: {} }));

vi.mock('@entities/loadout/config/constants/weapon-icons', () => ({ WEAPON_ICON: {} }));

vi.mock('@entities/loadout/config/constants/equipment-icons', () => ({ EQUIPMENT_ICON: {} }));

vi.mock('@entities/loadout/config/constants/shiv-type-icons', () => ({ SHIV_TYPE_ICON: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-content', () => ({ LOADOUT_ABILITY_CONTENT: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-icons', () => ({ LOADOUT_ABILITY_ICON: {} }));

describe('loadoutSlots', () => {
  it('adds a Tactical Rigging slot to biosoldier armor', () => {
    const slots = loadoutSlots({ armor: 'tactical-vest', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.utility).toEqual(['regular', 'regular', 'regular']);
  });

  it('adds no Tactical Rigging slot to Phalanx', () => {
    const slots = loadoutSlots({ armor: 'phalanx-armor', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.utility).toEqual(['regular', 'regular', 'regular']);
  });

  it('takes a regular slot away for an LMG', () => {
    const slots = loadoutSlots({ armor: 'tactical-vest', primary: 'lmg' }, GUNNER);

    expect(slots.utility).toEqual(['regular', 'regular']);
  });

  it('takes a regular slot away for a Stun Rifle', () => {
    const slots = loadoutSlots({ armor: 'phalanx-armor', primary: 'stun-rifle' }, ASSAULT);

    expect(slots.utility).toEqual(['regular', 'regular']);
  });

  it('puts Gear Slots last', () => {
    const slots = loadoutSlots({ armor: 'aegis-armor', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.utility).toEqual(['regular', 'regular', 'gear-slot', 'gear-slot']);
  });

  it('puts the Psi Slot last', () => {
    const slots = loadoutSlots({ armor: 'aurora-armor', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.utility).toEqual(['regular', 'regular', 'regular', 'psi-slot']);
  });

  it('keeps Gear Slots when an LMG takes the regular slots', () => {
    const slots = loadoutSlots({ armor: 'aegis-armor', primary: 'lmg' }, GUNNER);

    expect(slots.utility).toEqual(['regular', 'gear-slot', 'gear-slot']);
  });

  it('caps utility slots at four', () => {
    const slots = loadoutSlots({ armor: 'titan-armor', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.utility).toEqual(['regular', 'regular', 'regular', 'regular']);
  });

  it('gives a biosoldier no Module slots', () => {
    const slots = loadoutSlots({ armor: 'aegis-armor', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.moduleCount).toBe(0);
  });

  it('takes MEC utility slots from the exoskeleton without Tactical Rigging', () => {
    const slots = loadoutSlots({ armor: 'mec1-paladin', primary: 'minigun' }, MEC);

    expect(slots.utility).toEqual(['regular', 'regular']);
  });

  it('takes MEC Module slots from the exoskeleton', () => {
    const slots = loadoutSlots({ armor: 'lmec3-vindicator', primary: 'minigun' }, MEC);

    expect(slots.moduleCount).toBe(3);
  });

  it('takes SHIV utility slots from its type', () => {
    const slots = loadoutSlots({ armor: 'alloy-shiv', primary: 'autocannon' }, SHIV);

    expect(slots.utility).toEqual(['regular', 'regular', 'regular', 'regular']);
  });

  it('gives a class with a secondary weapon a secondary slot', () => {
    const slots = loadoutSlots({ armor: 'tactical-vest', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.hasSecondary).toBe(true);
  });

  it('gives a class without a secondary weapon no secondary slot', () => {
    const slots = loadoutSlots({ armor: 'tactical-vest', primary: 'lmg' }, GUNNER);

    expect(slots.hasSecondary).toBe(false);
  });

  it('gives a MEC no secondary slot', () => {
    const slots = loadoutSlots({ armor: 'mec1-paladin', primary: 'minigun' }, MEC);

    expect(slots.hasSecondary).toBe(false);
  });

  it('gives a SHIV no secondary slot', () => {
    const slots = loadoutSlots({ armor: 'shiv', primary: 'autocannon' }, SHIV);

    expect(slots.hasSecondary).toBe(false);
  });

  it('requires the secondary slot of a rocket launcher class', () => {
    const slots = loadoutSlots({ armor: 'tactical-vest', primary: 'assault-rifle' }, ROCKETEER);

    expect(slots.isSecondaryRequired).toBe(true);
  });

  it('leaves a pistol slot optional', () => {
    const slots = loadoutSlots({ armor: 'tactical-vest', primary: 'assault-rifle' }, ASSAULT);

    expect(slots.isSecondaryRequired).toBe(false);
  });
});

describe('utilitySlotSources', () => {
  it('counts the utility slots of biosoldier armor with its Gear Slots', () => {
    const sources = utilitySlotSources({ armor: 'aegis-armor', primary: 'assault-rifle' });

    expect(sources.armor).toBe(3);
  });

  it('counts Tactical Rigging on biosoldier armor', () => {
    const sources = utilitySlotSources({ armor: 'tactical-vest', primary: 'assault-rifle' });

    expect(sources.rigging).toBe(1);
  });

  it('counts no Tactical Rigging on Phalanx', () => {
    const sources = utilitySlotSources({ armor: 'phalanx-armor', primary: 'assault-rifle' });

    expect(sources.rigging).toBe(0);
  });

  it('counts no Tactical Rigging on a MEC exoskeleton', () => {
    const sources = utilitySlotSources({ armor: 'mec1-paladin', primary: 'minigun' });

    expect(sources.rigging).toBe(0);
  });

  it('counts the slot an LMG takes away', () => {
    const sources = utilitySlotSources({ armor: 'tactical-vest', primary: 'lmg' });

    expect(sources.weapon).toBe(-1);
  });

  it('counts the utility slots of a SHIV type', () => {
    const sources = utilitySlotSources({ armor: 'alloy-shiv', primary: 'autocannon' });

    expect(sources.armor).toBe(4);
  });

  it('counts the Gear Slots of the armor', () => {
    const sources = utilitySlotSources({ armor: 'aegis-armor', primary: 'assault-rifle' });

    expect(sources.gearSlots).toBe(2);
  });

  it('counts the Psi Slots of the armor', () => {
    const sources = utilitySlotSources({ armor: 'aurora-armor', primary: 'assault-rifle' });

    expect(sources.psiSlots).toBe(1);
  });

  it('counts the slots of biosoldier armor with Tactical Rigging', () => {
    const sources = utilitySlotSources({ armor: 'tactical-vest', primary: 'assault-rifle' });

    expect(sources).toMatchObject({ count: 3, isCapped: false });
  });

  it('counts the slots of Phalanx without Tactical Rigging', () => {
    const sources = utilitySlotSources({ armor: 'phalanx-armor', primary: 'assault-rifle' });

    expect(sources).toMatchObject({ count: 3, isCapped: false });
  });

  it('counts Gear Slots in the slots', () => {
    const sources = utilitySlotSources({ armor: 'aegis-armor', primary: 'assault-rifle' });

    expect(sources).toMatchObject({ count: 4, isCapped: false });
  });

  it('counts Psi Slots in the slots', () => {
    const sources = utilitySlotSources({ armor: 'aurora-armor', primary: 'assault-rifle' });

    expect(sources).toMatchObject({ count: 4, isCapped: false });
  });

  it('counts the slots without the one an LMG takes away', () => {
    const sources = utilitySlotSources({ armor: 'tactical-vest', primary: 'lmg' });

    expect(sources).toMatchObject({ count: 2, isCapped: false });
  });

  it('caps the slots of a sum above the maximum', () => {
    const sources = utilitySlotSources({ armor: 'titan-armor', primary: 'assault-rifle' });

    expect(sources).toMatchObject({ count: 4, isCapped: true });
  });

  it('counts no slots for a sum below zero', () => {
    const sources = utilitySlotSources({ armor: 'hmec2-defender', primary: 'lmg' });

    expect(sources).toMatchObject({ count: 0, isCapped: false });
  });

  it('counts the slots of a SHIV type', () => {
    const sources = utilitySlotSources({ armor: 'alloy-shiv', primary: 'autocannon' });

    expect(sources).toMatchObject({ count: 4, isCapped: false });
  });

  it('counts the slots of a MEC exoskeleton', () => {
    const sources = utilitySlotSources({ armor: 'mec1-paladin', primary: 'minigun' });

    expect(sources).toMatchObject({ count: 2, isCapped: false });
  });
});

describe('blockReasons', () => {
  it('lets a unit wear its armor', () => {
    const reasons = blockReasons('tactical-vest', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual([]);
  });

  it('keeps a MEC exoskeleton off a biosoldier', () => {
    const reasons = blockReasons('mec1-paladin', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('keeps a SHIV type off a biosoldier', () => {
    const reasons = blockReasons('shiv', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('lets a SHIV take its type in the armor slot', () => {
    const reasons = blockReasons('alloy-shiv', { kind: 'armor' }, createLoadoutMock({ armor: 'shiv', primary: 'autocannon' }), SHIV);

    expect(reasons).toEqual([]);
  });

  it('asks a Gene mod for gene-mod armor', () => {
    const reasons = blockReasons('ghost-armor', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['needs-gene-mod']);
  });

  it('lets a gene-modded unit wear gene-mod armor', () => {
    const reasons = blockReasons('ghost-armor', { kind: 'armor' }, createLoadoutMock(), GENE_MODDED);

    expect(reasons).toEqual([]);
  });

  it('asks a Psionic ability for psionic armor', () => {
    const reasons = blockReasons('aurora-armor', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['needs-psionic']);
  });

  it('asks an Officer for officer armor', () => {
    const reasons = blockReasons('seraph-armor', { kind: 'armor' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['needs-officer']);
  });

  it('lets an Officer wear officer armor', () => {
    const reasons = blockReasons('seraph-armor', { kind: 'armor' }, createLoadoutMock(), OFFICER);

    expect(reasons).toEqual([]);
  });

  it('lets a gene-modded Officer wear officer armor', () => {
    const reasons = blockReasons('seraph-armor', { kind: 'armor' }, createLoadoutMock(), { ...OFFICER, hasGeneMod: true });

    expect(reasons).toEqual([]);
  });

  it('keeps a weapon of another class off the primary slot', () => {
    const reasons = blockReasons('lmg', { kind: 'primary' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['class-limited']);
  });

  it('keeps a MEC weapon off a biosoldier', () => {
    const reasons = blockReasons('minigun', { kind: 'primary' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('keeps a secondary weapon off the primary slot', () => {
    const reasons = blockReasons('pistol', { kind: 'primary' }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('keeps a pistol off a class without one', () => {
    const reasons = blockReasons('pistol', { kind: 'secondary' }, createLoadoutMock(), GUNNER);

    expect(reasons).toEqual(['class-limited']);
  });

  it('lets a unit carry its equipment', () => {
    const reasons = blockReasons('he-grenade', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual([]);
  });

  it('keeps equipment of another unit off a biosoldier', () => {
    const reasons = blockReasons('motion-tracker', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('keeps a Module off a utility slot', () => {
    const reasons = blockReasons('flamethrower', { kind: 'utility', index: 0 }, createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', modules: [null] }), MEC);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('keeps equipment off a utility slot the unit does not have', () => {
    const reasons = blockReasons('he-grenade', { kind: 'utility', index: 3 }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('keeps a Module off a Module slot the unit does not have', () => {
    const reasons = blockReasons('flamethrower', { kind: 'module', index: 1 }, createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', modules: [null] }), MEC);

    expect(reasons).toEqual(['wrong-unit']);
  });

  it('keeps equipment of another class off', () => {
    const reasons = blockReasons('battle-scanner', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['class-limited']);
  });

  it('asks a Gene mod for gene-mod equipment', () => {
    const reasons = blockReasons('chitin-plating', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['needs-gene-mod']);
  });

  it('asks a Psionic ability for psionic equipment', () => {
    const reasons = blockReasons('psi-frayer', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['needs-psionic']);
  });

  it('keeps a second copy of equipment off', () => {
    const reasons = blockReasons('he-grenade', { kind: 'utility', index: 0 }, createLoadoutMock({ utility: [null, 'he-grenade'] }), ASSAULT);

    expect(reasons).toEqual(['max-one']);
  });

  it('keeps a second copy of a Module off', () => {
    const reasons = blockReasons('flamethrower', { kind: 'module', index: 0 }, createLoadoutMock({ armor: 'lmec3-vindicator', primary: 'minigun', modules: [null, 'flamethrower', null] }), MEC);

    expect(reasons).toEqual(['max-one']);
  });

  it('lets equipment stay in its own slot', () => {
    const reasons = blockReasons('he-grenade', { kind: 'utility', index: 1 }, createLoadoutMock({ utility: [null, 'he-grenade'] }), ASSAULT);

    expect(reasons).toEqual([]);
  });

  it('keeps equipment of a group already carried off', () => {
    const reasons = blockReasons('alloy-plating', { kind: 'utility', index: 0 }, createLoadoutMock({ utility: [null, 'ceramic-plating'] }), ASSAULT);

    expect(reasons).toEqual(['cant-stack']);
  });

  it('lets equipment replace an item of its group in the same slot', () => {
    const reasons = blockReasons('alloy-plating', { kind: 'utility', index: 0 }, createLoadoutMock({ utility: ['ceramic-plating', null] }), ASSAULT);

    expect(reasons).toEqual([]);
  });

  it('keeps equipment off a primary weapon of another tier', () => {
    const reasons = blockReasons('reaper-ammo', { kind: 'utility', index: 0 }, createLoadoutMock(), ASSAULT);

    expect(reasons).toEqual(['unsupported-weapon']);
  });

  it('lets equipment work with a primary weapon of its tier', () => {
    const reasons = blockReasons('reaper-ammo', { kind: 'utility', index: 0 }, createLoadoutMock({ primary: 'laser-rifle' }), ASSAULT);

    expect(reasons).toEqual([]);
  });

  it('keeps equipment off a primary weapon of another type', () => {
    const reasons = blockReasons('drum-mags', { kind: 'utility', index: 0 }, createLoadoutMock({ primary: 'strike-rifle' }), SCOUT);

    expect(reasons).toEqual(['unsupported-weapon']);
  });

  it('asks the Module an upgrade needs', () => {
    const reasons = blockReasons('the-thumper', { kind: 'utility', index: 0 }, createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', modules: ['flamethrower'] }), MEC);

    expect(reasons).toEqual(['needs-module']);
  });

  it('lets an upgrade go with its Module', () => {
    const reasons = blockReasons('the-thumper', { kind: 'utility', index: 0 }, createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', modules: ['kinetic-strike-module'] }), MEC);

    expect(reasons).toEqual([]);
  });

  it('keeps active equipment off a Gear Slot', () => {
    const reasons = blockReasons('he-grenade', { kind: 'utility', index: 2 }, createLoadoutMock({ armor: 'aegis-armor', utility: [null, null, null, null] }), ASSAULT);

    expect(reasons).toEqual(['gear-slot-passive-only']);
  });

  it('lets passive equipment take a Gear Slot', () => {
    const reasons = blockReasons('alloy-plating', { kind: 'utility', index: 2 }, createLoadoutMock({ armor: 'aegis-armor', utility: [null, null, null, null] }), ASSAULT);

    expect(reasons).toEqual([]);
  });

  it('keeps passive equipment that is not psionic off a Psi Slot', () => {
    const reasons = blockReasons('alloy-plating', { kind: 'utility', index: 3 }, createLoadoutMock({ armor: 'aurora-armor', utility: [null, null, null, null] }), PSIONIC);

    expect(reasons).toEqual(['psi-slot-psi-only']);
  });

  it('lets passive psionic equipment take a Psi Slot', () => {
    const reasons = blockReasons('psi-frayer', { kind: 'utility', index: 3 }, createLoadoutMock({ armor: 'aurora-armor', utility: [null, null, null, null] }), PSIONIC);

    expect(reasons).toEqual([]);
  });

  it('lists every reason in the fixed order', () => {
    const loadout = createLoadoutMock({ armor: 'aegis-armor', utility: ['psi-grenade', 'concussion-grenade', null, null] });

    const reasons = blockReasons('psi-grenade', { kind: 'utility', index: 2 }, loadout, ASSAULT);

    expect(reasons).toEqual(['needs-psionic', 'max-one', 'cant-stack', 'gear-slot-passive-only']);
  });
});

describe('defaultLoadout', () => {
  it('gives a biosoldier the first armor and primary weapon with empty slots', () => {
    const loadout = defaultLoadout(ASSAULT);

    expect(loadout).toEqual({ armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] });
  });

  it('gives a rocket launcher class its rocket launcher', () => {
    const loadout = defaultLoadout(ROCKETEER);

    expect(loadout?.secondary).toBe('rocket-launcher');
  });

  it('gives a MEC the first exoskeleton and MEC weapon with empty Module slots', () => {
    const loadout = defaultLoadout(MEC);

    expect(loadout).toEqual({ armor: 'mec1-paladin', primary: 'minigun', secondary: null, utility: [null, null], modules: [null] });
  });

  it('gives a SHIV the first SHIV type and SHIV weapon', () => {
    const loadout = defaultLoadout(SHIV);

    expect(loadout).toEqual({ armor: 'shiv', primary: 'autocannon', secondary: null, utility: [null, null], modules: [] });
  });
});
