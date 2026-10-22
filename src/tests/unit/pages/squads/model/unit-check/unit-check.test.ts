import { describe, expect, it, vi } from 'vitest';

import { checkSquad, checkUnit, unitCheckToast } from '@pages/squads/model/unit-check';

import {
  createBiosoldierBuildMock,
  FIT_UNIT,
  GENE_MODS,
  GRENADE_UNIT,
  LOST_UNIT,
  MEC_BUILD,
  MEC_DEFAULT_LOADOUT,
  MEC_LINE,
  MEC_UNIT,
  MEC_WEARER,
  OFFICER_PERKS,
  ONE_REMOVED_LINE,
  PSIONIC_ABILITIES,
  SECOND_LOST_UNIT,
  SECOND_SNIPER_UNIT,
  SERAPH_LOADOUT,
  SERAPH_REPLACED,
  SHIV_BUILD,
  SHIV_DEFAULT_LOADOUT,
  SHIV_WEARER,
  SNIPER_DEFAULT_LOADOUT,
  SNIPER_LINE,
  SNIPER_UNIT,
  SNIPER_WEARER,
  SNIPERS_IN_ORDER_LINE,
  SQUAD_BUILDS,
  TOAST_TITLE,
  TWO_REMOVED_LINE,
  TWO_SNIPERS_LINE,
  UNKNOWN_CODES_LOADOUT,
  UNKNOWN_CODES_UNIT,
} from './unit-check.mock';

vi.mock('@entities/loadout/config/constants/armor-content', async () => ({
  ARMOR_CONTENT: (await import('./unit-check.mock')).ARMOR_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/weapon-content', async () => ({
  WEAPON_CONTENT: (await import('./unit-check.mock')).WEAPON_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/equipment-content', async () => ({
  EQUIPMENT_CONTENT: (await import('./unit-check.mock')).EQUIPMENT_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/shiv-type-content', async () => ({
  SHIV_TYPE_CONTENT: (await import('./unit-check.mock')).SHIV_TYPE_CONTENT_MOCK,
}));

vi.mock('@entities/loadout/config/constants/armor-icons', () => ({ ARMOR_ICON: {} }));

vi.mock('@entities/loadout/config/constants/weapon-icons', () => ({ WEAPON_ICON: {} }));

vi.mock('@entities/loadout/config/constants/equipment-icons', () => ({ EQUIPMENT_ICON: {} }));

vi.mock('@entities/loadout/config/constants/shiv-type-icons', () => ({ SHIV_TYPE_ICON: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-content', () => ({ LOADOUT_ABILITY_CONTENT: {} }));

vi.mock('@entities/loadout/config/constants/loadout-ability-icons', () => ({ LOADOUT_ABILITY_ICON: {} }));

describe('checkUnit', () => {
  it('gives a new Unit the Default Loadout', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock());

    expect(unit?.loadout).toEqual(SNIPER_DEFAULT_LOADOUT);
  });

  it.each([
    { name: 'a MEC', squadBuild: MEC_BUILD, expected: MEC_DEFAULT_LOADOUT },
    { name: 'a SHIV', squadBuild: SHIV_BUILD, expected: SHIV_DEFAULT_LOADOUT },
  ])('gives a new Unit of $name the Default Loadout of its kind', ({ squadBuild, expected }) => {
    const unit = checkUnit(null, squadBuild);

    expect(unit?.loadout).toEqual(expected);
  });

  it.each([
    { name: 'a biosoldier', squadBuild: createBiosoldierBuildMock(), expected: SNIPER_WEARER },
    { name: 'a MEC, never an Officer', squadBuild: MEC_BUILD, expected: MEC_WEARER },
    { name: 'a SHIV, without a class', squadBuild: SHIV_BUILD, expected: SHIV_WEARER },
  ])('takes the profile of $name from its Build', ({ squadBuild, expected }) => {
    const unit = checkUnit(null, squadBuild);

    expect(unit?.wearer).toEqual(expected);
  });

  it('counts a gene mod of a biosoldier Build', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock({ geneMods: GENE_MODS }));

    expect(unit?.wearer.hasGeneMod).toBe(true);
  });

  it('counts a psionic ability of a biosoldier Build', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock({ psionicAbilities: PSIONIC_ABILITIES }));

    expect(unit?.wearer.hasPsionicAbility).toBe(true);
  });

  it('makes a biosoldier with an officer perk an Officer', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock({ officerPerks: OFFICER_PERKS }));

    expect(unit?.wearer.isOfficer).toBe(true);
  });

  it('puts the default armor and primary weapon in place of unknown codes', () => {
    const unit = checkUnit(UNKNOWN_CODES_LOADOUT, createBiosoldierBuildMock());

    expect(unit?.loadout).toEqual(SNIPER_DEFAULT_LOADOUT);
  });

  it('replaces unknown codes silently', () => {
    const unit = checkUnit(UNKNOWN_CODES_LOADOUT, createBiosoldierBuildMock());

    expect(unit?.changes).toEqual([]);
  });

  it('replaces Seraph armor of a Build without officer perks', () => {
    const unit = checkUnit(SERAPH_LOADOUT, createBiosoldierBuildMock());

    expect(unit?.changes).toEqual(SERAPH_REPLACED);
  });

  it('keeps Seraph armor of an Officer', () => {
    const unit = checkUnit(SERAPH_LOADOUT, createBiosoldierBuildMock({ officerPerks: OFFICER_PERKS }));

    expect(unit?.loadout).toEqual(SERAPH_LOADOUT);
  });
});

describe('checkSquad', () => {
  it('checks each Unit with its Build', () => {
    const check = checkSquad([SNIPER_UNIT], SQUAD_BUILDS);

    expect(check.units[0]?.changes).toEqual(SERAPH_REPLACED);
  });

  it('keeps the id and Build of a checked Unit', () => {
    const check = checkSquad([SNIPER_UNIT], SQUAD_BUILDS);

    expect(check.units[0]?.unit).toBe(SNIPER_UNIT);
  });

  it('leaves out a Unit whose Build is gone', () => {
    const check = checkSquad([SNIPER_UNIT, LOST_UNIT], SQUAD_BUILDS);

    expect(check.units.map(unit => unit.unit.id)).toEqual([SNIPER_UNIT.id]);
  });

  it('reports a Unit whose Build is gone as removed', () => {
    const check = checkSquad([SNIPER_UNIT, LOST_UNIT], SQUAD_BUILDS);

    expect(check.removed).toEqual([LOST_UNIT]);
  });
});

describe('checkSquad isChanged', () => {
  it('is false when every Loadout fits and every Build is saved', () => {
    const check = checkSquad([FIT_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(false);
  });

  it('is true when a Loadout no longer fits', () => {
    const check = checkSquad([FIT_UNIT, SNIPER_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(true);
  });

  it('is true when unknown codes were replaced silently', () => {
    const check = checkSquad([UNKNOWN_CODES_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(true);
  });

  it('is true when a Unit leaves with its Build', () => {
    const check = checkSquad([FIT_UNIT, LOST_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(true);
  });
});

describe('unitCheckToast', () => {
  it('is null when nothing changed', () => {
    const toast = unitCheckToast(checkSquad([FIT_UNIT], SQUAD_BUILDS));

    expect(toast).toBeNull();
  });

  it('is null when only unknown codes were replaced', () => {
    const toast = unitCheckToast(checkSquad([UNKNOWN_CODES_UNIT], SQUAD_BUILDS));

    expect(toast).toBeNull();
  });

  it('tells the changes of a Unit on the line of its Build', () => {
    const toast = unitCheckToast(checkSquad([SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast).toEqual({ title: TOAST_TITLE, description: SNIPER_LINE });
  });

  it('counts only the changed Units of a Build', () => {
    const toast = unitCheckToast(checkSquad([SNIPER_UNIT, FIT_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(SNIPER_LINE);
  });

  it('groups the changed Units of one Build without repeating a change', () => {
    const toast = unitCheckToast(checkSquad([SNIPER_UNIT, SECOND_SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(TWO_SNIPERS_LINE);
  });

  it('keeps the changes of a Build in the order they first appear', () => {
    const toast = unitCheckToast(checkSquad([SNIPER_UNIT, GRENADE_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(SNIPERS_IN_ORDER_LINE);
  });

  it('gives each Build its own line in Squad order', () => {
    const toast = unitCheckToast(checkSquad([MEC_UNIT, SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(`${MEC_LINE}\n${SNIPER_LINE}`);
  });

  it('tells a Unit whose Build is gone on the last line', () => {
    const toast = unitCheckToast(checkSquad([LOST_UNIT, SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(`${SNIPER_LINE}\n${ONE_REMOVED_LINE}`);
  });

  it('counts the Units whose Build is gone', () => {
    const toast = unitCheckToast(checkSquad([LOST_UNIT, SECOND_LOST_UNIT], SQUAD_BUILDS));

    expect(toast).toEqual({ title: TOAST_TITLE, description: TWO_REMOVED_LINE });
  });
});
