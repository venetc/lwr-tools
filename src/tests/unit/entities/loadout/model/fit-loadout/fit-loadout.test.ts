import { describe, expect, it, vi } from 'vitest';

import { fitLoadout } from '@entities/loadout/model/fit-loadout';

import { ASSAULT, createLoadoutMock, GUNNER, MEC, ROCKETEER, SHIV } from '../loadout/loadout.mock';
import { createMecLoadoutMock } from './fit-loadout.mock';

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

describe('fitLoadout', () => {
  it('keeps a fitting Loadout', () => {
    const loadout = createLoadoutMock({ secondary: 'pistol', utility: ['he-grenade', 'alloy-plating', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.loadout).toEqual({ armor: 'tactical-vest', primary: 'assault-rifle', secondary: 'pistol', utility: ['he-grenade', 'alloy-plating', null], modules: [] });
  });

  it('reports no changes for a fitting Loadout', () => {
    const loadout = createLoadoutMock({ secondary: 'pistol', utility: ['he-grenade', 'alloy-plating', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([]);
  });

  it('leaves the given Loadout untouched', () => {
    const loadout = createLoadoutMock({ utility: ['he-grenade', 'medikit', 'alloy-plating', 'scope'] });

    fitLoadout(loadout, ASSAULT);

    expect(loadout.utility).toEqual(['he-grenade', 'medikit', 'alloy-plating', 'scope']);
  });

  it('cuts the utility slots the armor no longer has from the end', () => {
    const loadout = createLoadoutMock({ utility: ['he-grenade', 'medikit', 'alloy-plating', 'scope'] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.loadout.utility).toEqual(['he-grenade', 'medikit', 'alloy-plating']);
  });

  it('reports items of cut slots as removed', () => {
    const loadout = createLoadoutMock({ utility: ['he-grenade', 'medikit', 'alloy-plating', 'scope'] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'utility', item: 'scope', reason: 'slot-removed' }]);
  });

  it('adds empty utility slots the armor gains', () => {
    const loadout = createLoadoutMock({ armor: 'titan-armor', utility: ['he-grenade', 'medikit', 'alloy-plating'] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.loadout.utility).toEqual(['he-grenade', 'medikit', 'alloy-plating', null]);
  });

  it('cuts the utility slot an LMG takes away', () => {
    const loadout = createLoadoutMock({ primary: 'lmg', utility: ['he-grenade', 'medikit', 'scope'] });

    const fit = fitLoadout(loadout, GUNNER);

    expect(fit.loadout.utility).toEqual(['he-grenade', 'medikit']);
  });

  it('keeps Gear Slot items when the primary weapon takes a regular slot away', () => {
    const loadout = createLoadoutMock({ armor: 'aegis-armor', primary: 'stun-rifle', utility: ['medikit', 'he-grenade', 'alloy-plating', 'scope'] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.loadout.utility).toEqual(['medikit', 'alloy-plating', 'scope']);
  });

  it('cuts the last regular slot when the primary weapon takes one away', () => {
    const loadout = createLoadoutMock({ armor: 'aegis-armor', primary: 'stun-rifle', utility: ['medikit', 'he-grenade', 'alloy-plating', 'scope'] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'utility', item: 'he-grenade', reason: 'slot-removed' }]);
  });

  it('cuts the utility slots a smaller SHIV type has', () => {
    const loadout = createLoadoutMock({ armor: 'shiv', primary: 'autocannon', utility: ['scope', 'motion-tracker', 'reaper-ammo', null] });

    const fit = fitLoadout(loadout, SHIV);

    expect(fit.loadout.utility).toEqual(['scope', 'motion-tracker']);
  });

  it('cuts the Module slots a smaller exoskeleton has', () => {
    const loadout = createMecLoadoutMock({ modules: ['flamethrower', 'kinetic-strike-module', null] });

    const fit = fitLoadout(loadout, MEC);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'module', item: 'kinetic-strike-module', reason: 'slot-removed' }]);
  });

  it('moves an item a Gear Slot does not hold to a free regular slot', () => {
    const loadout = createLoadoutMock({ armor: 'aegis-armor', utility: ['alloy-plating', null, 'he-grenade', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.loadout.utility).toEqual(['alloy-plating', 'he-grenade', null, null]);
  });

  it('reports the move out of a Gear Slot', () => {
    const loadout = createLoadoutMock({ armor: 'aegis-armor', utility: ['alloy-plating', null, 'he-grenade', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'moved', item: 'he-grenade', from: 2, to: 1 }]);
  });

  it('removes an item a Gear Slot does not hold when no regular slot is free', () => {
    const loadout = createLoadoutMock({ armor: 'aegis-armor', utility: ['alloy-plating', 'medikit', 'he-grenade', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'utility', item: 'he-grenade', reason: 'gear-slot-passive-only' }]);
  });

  it('removes equipment the primary weapon does not support', () => {
    const loadout = createLoadoutMock({ utility: ['reaper-ammo', 'medikit', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'utility', item: 'reaper-ammo', reason: 'unsupported-weapon' }]);
  });

  it('keeps the first of two items that do not stack', () => {
    const loadout = createLoadoutMock({ utility: ['alloy-plating', 'ceramic-plating', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.loadout.utility).toEqual(['alloy-plating', null, null]);
  });

  it('removes a second copy of an item', () => {
    const loadout = createLoadoutMock({ utility: ['he-grenade', 'he-grenade', null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'utility', item: 'he-grenade', reason: 'max-one' }]);
  });

  it('removes an upgrade whose Module is gone', () => {
    const loadout = createMecLoadoutMock({ utility: ['the-thumper', null], modules: ['flamethrower'] });

    const fit = fitLoadout(loadout, MEC);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'utility', item: 'the-thumper', reason: 'needs-module' }]);
  });

  it('puts the default armor in place of armor that no longer fits', () => {
    const loadout = createLoadoutMock({ armor: 'seraph-armor', utility: [null, null, null, null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'replaced', slot: 'armor', item: 'seraph-armor', by: 'tactical-vest', reason: 'needs-officer' }]);
  });

  it('counts utility slots of the default armor', () => {
    const loadout = createLoadoutMock({ armor: 'seraph-armor', utility: [null, null, null, null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.loadout.utility).toEqual([null, null, null]);
  });

  it('puts the default primary weapon in place of one that no longer fits', () => {
    const loadout = createLoadoutMock({ primary: 'lmg', utility: [null, null] });

    const fit = fitLoadout(loadout, ASSAULT);

    expect(fit.changes).toEqual([{ kind: 'replaced', slot: 'primary', item: 'lmg', by: 'assault-rifle', reason: 'class-limited' }]);
  });

  it('removes a secondary weapon that no longer fits', () => {
    const loadout = createLoadoutMock({ primary: 'lmg', secondary: 'pistol' });

    const fit = fitLoadout(loadout, GUNNER);

    expect(fit.changes).toEqual([{ kind: 'removed', slot: 'secondary', item: 'pistol', reason: 'class-limited' }]);
  });

  it('puts the default secondary weapon in place of one that no longer fits a required slot', () => {
    const loadout = createLoadoutMock({ secondary: 'pistol', utility: [null, null, null] });

    const fit = fitLoadout(loadout, ROCKETEER);

    expect(fit.changes).toEqual([{ kind: 'replaced', slot: 'secondary', item: 'pistol', by: 'rocket-launcher', reason: 'class-limited' }]);
  });

  it('fills an empty required secondary slot', () => {
    const loadout = createLoadoutMock({ utility: [null, null, null] });

    const fit = fitLoadout(loadout, ROCKETEER);

    expect(fit.loadout.secondary).toBe('rocket-launcher');
  });

  it('reports the default secondary weapon put in an empty required slot', () => {
    const loadout = createLoadoutMock({ utility: [null, null, null] });

    const fit = fitLoadout(loadout, ROCKETEER);

    expect(fit.changes).toEqual([{ kind: 'added', slot: 'secondary', item: 'rocket-launcher' }]);
  });
});
