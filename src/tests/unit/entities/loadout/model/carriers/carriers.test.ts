import { describe, expect, it } from 'vitest';

import { itemCarriers } from '@entities/loadout/model/carriers';

import {
  ALL_UNITS_EQUIPMENT,
  ANY_BIOSOLDIER_WEAPON,
  EVERY_CLASS_EQUIPMENT,
  FIVE_CLASS_WEAPON,
  FOUR_CLASS_EQUIPMENT,
  GENE_MOD_ARMOR,
  MEC_SHIV_EQUIPMENT,
  MEC_WEAPON,
  OFFICER_ARMOR,
  ONE_CLASS_EQUIPMENT,
  PISTOL,
  PSIONIC_EQUIPMENT,
  SHIV_WEAPON,
  SOLDIER_EQUIPMENT,
} from './carriers.mock';

describe('itemCarriers', () => {
  it('names an item of every Biosoldier "Biosoldier"', () => {
    const carriers = itemCarriers(ANY_BIOSOLDIER_WEAPON);

    expect(carriers).toBe('Biosoldier');
  });

  it('lists up to four classes in the game order', () => {
    const carriers = itemCarriers(FOUR_CLASS_EQUIPMENT);

    expect(carriers).toBe('Sniper/Scout/Rocketeer/Gunner');
  });

  it('names five or more classes by the classes left out', () => {
    const carriers = itemCarriers(FIVE_CLASS_WEAPON);

    expect(carriers).toBe('Biosoldier except Sniper/Rocketeer/Gunner');
  });

  it('names a Psionic ability requirement "Psi Soldier" in place of the unit', () => {
    const carriers = itemCarriers(PSIONIC_EQUIPMENT);

    expect(carriers).toBe('Psi Soldier');
  });

  it('names an item of every unit type "All Units"', () => {
    const carriers = itemCarriers(ALL_UNITS_EQUIPMENT);

    expect(carriers).toBe('All Units');
  });

  it('joins the unit types of a set the game does not name', () => {
    const carriers = itemCarriers(MEC_SHIV_EQUIPMENT);

    expect(carriers).toBe('MEC/SHIV');
  });

  it('names a Gene mod requirement "Gene-Modded" in place of the unit', () => {
    const carriers = itemCarriers(GENE_MOD_ARMOR);

    expect(carriers).toBe('Gene-Modded');
  });

  it('names an officer requirement "Officer" in place of the unit', () => {
    const carriers = itemCarriers(OFFICER_ARMOR);

    expect(carriers).toBe('Officer');
  });

  it('names an item of Biosoldiers and MECs "Soldier"', () => {
    const carriers = itemCarriers(SOLDIER_EQUIPMENT);

    expect(carriers).toBe('Soldier');
  });

  it('names an item of MECs "MEC"', () => {
    const carriers = itemCarriers(MEC_WEAPON);

    expect(carriers).toBe('MEC');
  });

  it('names an item of SHIVs "SHIV"', () => {
    const carriers = itemCarriers(SHIV_WEAPON);

    expect(carriers).toBe('SHIV');
  });

  it('names an item of one class by the class', () => {
    const carriers = itemCarriers(ONE_CLASS_EQUIPMENT);

    expect(carriers).toBe('Engineer');
  });

  it('names a pistol by the classes without a pistol slot', () => {
    const carriers = itemCarriers(PISTOL);

    expect(carriers).toBe('Biosoldier except Rocketeer/Gunner');
  });

  it('names an item that lists every class "Biosoldier"', () => {
    const carriers = itemCarriers(EVERY_CLASS_EQUIPMENT);

    expect(carriers).toBe('Biosoldier');
  });
});
