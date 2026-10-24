import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultLoadout, fitLoadout } from '@entities/loadout';
import { checkSquad, checkUnit, unitCheckBuildLines, unitCheckToast } from '@pages/squads/model/unit-check';

import {
  createBiosoldierBuildMock,
  defaultLoadoutStub,
  FIT_UNIT,
  GENE_MODS,
  GRENADE_UNIT,
  keepingFitStub,
  LOST_BUILD_KEY,
  LOST_UNIT,
  MEC_BUILD,
  MEC_GRENADE_FIT,
  MEC_LINE,
  MEC_UNIT,
  MEC_WEARER,
  OFFICER_PERKS,
  ONE_REMOVED_LINE,
  OUTDATED_UNIT,
  OUTDATED_UNKNOWN_CODES_UNIT,
  PSIONIC_ABILITIES,
  SECOND_LOST_UNIT,
  SECOND_SNIPER_UNIT,
  SERAPH_AND_GRENADE_FIT,
  SERAPH_FIT,
  SERAPH_LOADOUT,
  SERAPH_REPLACED,
  SHIV_BUILD,
  SHIV_SHOWN_LOADOUT,
  SHIV_WEARER,
  SNIPER_BUILD_KEY,
  SNIPER_DEFAULT_LOADOUT,
  SNIPER_LINE,
  SNIPER_UNIT,
  SNIPER_WEARER,
  SNIPERS_IN_ORDER_LINE,
  SQUAD_BUILDS,
  TOAST_TITLE,
  TWO_REMOVED_LINE,
  TWO_SNIPERS_LINE,
  UNKNOWN_CODES_FIT_INPUT,
  UNKNOWN_CODES_LOADOUT,
  UNKNOWN_CODES_UNIT,
} from './unit-check.mock';

vi.mock('@entities/loadout', async () => ({
  LOADOUT_UNITS: [],
  defaultLoadout: vi.fn(),
  findLoadoutItem: (await import('./unit-check.mock')).findLoadoutItemStub,
  fitLoadout: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(defaultLoadout).mockReset().mockImplementation(defaultLoadoutStub);
  vi.mocked(fitLoadout).mockReset().mockImplementation(keepingFitStub);
});

describe('checkUnit', () => {
  it('gives a new Unit the Default Loadout', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock());

    expect(unit?.loadout).toEqual(SNIPER_DEFAULT_LOADOUT);
  });

  it('does not fit the Loadout of a new Unit', () => {
    checkUnit(null, createBiosoldierBuildMock());

    expect(fitLoadout).not.toHaveBeenCalled();
  });

  it('gives null when no armor or primary weapon fits the Unit', () => {
    vi.mocked(defaultLoadout).mockReturnValueOnce(null);

    const unit = checkUnit(SERAPH_LOADOUT, createBiosoldierBuildMock());

    expect(unit).toBeNull();
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

  it('counts a gene mod of a biosoldier Build with a psionic ability', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock({ geneMods: GENE_MODS, psionicAbilities: PSIONIC_ABILITIES }));

    expect(unit?.wearer.hasGeneMod).toBe(true);
  });

  it('counts a psionic ability of a biosoldier Build with a gene mod', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock({ geneMods: GENE_MODS, psionicAbilities: PSIONIC_ABILITIES }));

    expect(unit?.wearer.hasPsionicAbility).toBe(true);
  });

  it('makes a biosoldier with an officer perk an Officer', () => {
    const unit = checkUnit(null, createBiosoldierBuildMock({ officerPerks: OFFICER_PERKS }));

    expect(unit?.wearer.isOfficer).toBe(true);
  });

  it('fits the Loadout to the profile of the Unit', () => {
    checkUnit(SERAPH_LOADOUT, createBiosoldierBuildMock());

    expect(fitLoadout).toHaveBeenLastCalledWith(SERAPH_LOADOUT, SNIPER_WEARER);
  });

  it('puts the default armor and primary weapon in place of unknown codes before fitting', () => {
    checkUnit(UNKNOWN_CODES_LOADOUT, createBiosoldierBuildMock());

    expect(fitLoadout).toHaveBeenLastCalledWith(UNKNOWN_CODES_FIT_INPUT, SNIPER_WEARER);
  });

  it('gives the fitted Loadout', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT);

    const unit = checkUnit(SERAPH_LOADOUT, createBiosoldierBuildMock());

    expect(unit?.loadout).toEqual(SNIPER_DEFAULT_LOADOUT);
  });

  it('gives the changes of the fit', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT);

    const unit = checkUnit(SERAPH_LOADOUT, createBiosoldierBuildMock());

    expect(unit?.changes).toEqual(SERAPH_REPLACED);
  });
});

describe('checkSquad', () => {
  it('checks each Unit with its Build', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT);

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

describe('checkSquad with an Outdated build', () => {
  it('keeps a Unit of an Outdated build in the Squad', () => {
    const check = checkSquad([OUTDATED_UNIT], SQUAD_BUILDS);

    expect(check.units.map(unit => unit.unit.id)).toEqual([OUTDATED_UNIT.id]);
  });

  it('marks a Unit of an Outdated build', () => {
    const check = checkSquad([OUTDATED_UNIT], SQUAD_BUILDS);

    expect(check.units[0]?.isOutdated).toBe(true);
  });

  it('does not mark a Unit of a regular build', () => {
    const check = checkSquad([SNIPER_UNIT], SQUAD_BUILDS);

    expect(check.units[0]?.isOutdated).toBe(false);
  });

  it('does not fit the Loadout of a Unit of an Outdated build', () => {
    checkSquad([OUTDATED_UNIT], SQUAD_BUILDS);

    expect(fitLoadout).not.toHaveBeenCalled();
  });

  it('keeps the Loadout of a Unit of an Outdated build', () => {
    vi.mocked(fitLoadout).mockReturnValue(SERAPH_FIT);

    const check = checkSquad([OUTDATED_UNIT], SQUAD_BUILDS);

    expect(check.units[0]?.loadout).toEqual(SERAPH_LOADOUT);
  });

  it('shows the default armor and primary weapon in place of unknown codes of an Outdated build', () => {
    const check = checkSquad([OUTDATED_UNKNOWN_CODES_UNIT], SQUAD_BUILDS);

    expect(check.units[0]?.loadout).toEqual(SHIV_SHOWN_LOADOUT);
  });

  it('gives a Unit of an Outdated build no changes', () => {
    vi.mocked(fitLoadout).mockReturnValue(SERAPH_FIT);

    const check = checkSquad([OUTDATED_UNIT], SQUAD_BUILDS);

    expect(check.units[0]?.changes).toEqual([]);
  });
});

describe('checkSquad isChanged', () => {
  it('is false when every Loadout fits and every Build is saved', () => {
    const check = checkSquad([FIT_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(false);
  });

  it('is true when a Loadout no longer fits', () => {
    vi.mocked(fitLoadout).mockImplementationOnce(keepingFitStub).mockReturnValueOnce(SERAPH_FIT);

    const check = checkSquad([FIT_UNIT, SNIPER_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(true);
  });

  it('is true when unknown codes were replaced silently', () => {
    const check = checkSquad([UNKNOWN_CODES_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(true);
  });

  it('is false when unknown codes of an Outdated build stay', () => {
    const check = checkSquad([OUTDATED_UNKNOWN_CODES_UNIT], SQUAD_BUILDS);

    expect(check.isChanged).toBe(false);
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

  it('leaves a Unit of an Outdated build out', () => {
    vi.mocked(fitLoadout).mockReturnValue(SERAPH_FIT);

    const toast = unitCheckToast(checkSquad([OUTDATED_UNIT], SQUAD_BUILDS));

    expect(toast).toBeNull();
  });

  it('is null when only unknown codes were replaced', () => {
    const toast = unitCheckToast(checkSquad([UNKNOWN_CODES_UNIT], SQUAD_BUILDS));

    expect(toast).toBeNull();
  });

  it('tells the changes of a Unit on the line of its Build', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT);

    const toast = unitCheckToast(checkSquad([SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast).toEqual({ title: TOAST_TITLE, description: SNIPER_LINE });
  });

  it('counts only the changed Units of a Build', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT);

    const toast = unitCheckToast(checkSquad([SNIPER_UNIT, FIT_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(SNIPER_LINE);
  });

  it('groups the changed Units of one Build without repeating a change', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT).mockReturnValueOnce(SERAPH_FIT);

    const toast = unitCheckToast(checkSquad([SNIPER_UNIT, SECOND_SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(TWO_SNIPERS_LINE);
  });

  it('keeps the changes of a Build in the order they first appear', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT).mockReturnValueOnce(SERAPH_AND_GRENADE_FIT);

    const toast = unitCheckToast(checkSquad([SNIPER_UNIT, GRENADE_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(SNIPERS_IN_ORDER_LINE);
  });

  it('gives each Build its own line in Squad order', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(MEC_GRENADE_FIT).mockReturnValueOnce(SERAPH_FIT);

    const toast = unitCheckToast(checkSquad([MEC_UNIT, SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(`${MEC_LINE}\n${SNIPER_LINE}`);
  });

  it('tells a Unit whose Build is gone on the last line', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT);

    const toast = unitCheckToast(checkSquad([LOST_UNIT, SNIPER_UNIT], SQUAD_BUILDS));

    expect(toast?.description).toBe(`${SNIPER_LINE}\n${ONE_REMOVED_LINE}`);
  });

  it('counts the Units whose Build is gone', () => {
    const toast = unitCheckToast(checkSquad([LOST_UNIT, SECOND_LOST_UNIT], SQUAD_BUILDS));

    expect(toast).toEqual({ title: TOAST_TITLE, description: TWO_REMOVED_LINE });
  });
});

describe('unitCheckBuildLines', () => {
  it('gives a Build with changed Units its toast line', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(MEC_GRENADE_FIT).mockReturnValueOnce(SERAPH_FIT);

    const lines = unitCheckBuildLines(checkSquad([MEC_UNIT, SNIPER_UNIT], SQUAD_BUILDS));

    expect(lines.get(SNIPER_BUILD_KEY)).toBe(SNIPER_LINE);
  });

  it('gives no line to a Build whose Units fit', () => {
    vi.mocked(fitLoadout).mockImplementationOnce(keepingFitStub).mockReturnValueOnce(MEC_GRENADE_FIT);

    const lines = unitCheckBuildLines(checkSquad([FIT_UNIT, MEC_UNIT], SQUAD_BUILDS));

    expect(lines.has(SNIPER_BUILD_KEY)).toBe(false);
  });

  it('gives no line to Units whose Build is gone', () => {
    vi.mocked(fitLoadout).mockReturnValueOnce(SERAPH_FIT);

    const lines = unitCheckBuildLines(checkSquad([LOST_UNIT, SNIPER_UNIT], SQUAD_BUILDS));

    expect(lines.has(LOST_BUILD_KEY)).toBe(false);
  });
});
