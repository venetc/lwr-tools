import { describe, expect, it } from 'vitest';

import { parseSquad, serializeSquad } from '@features/manage-squads/model/squad-record';

import {
  BIOSOLDIER_UNIT,
  INVALID_UNIT_RECORD,
  OFFICER_MARK_RECORD,
  SHIV_RECORD,
  SHIV_UNIT,
  SQUAD,
  SQUAD_ID,
  SQUAD_RECORD,
  UNKNOWN_CODES_LOADOUT,
  UNKNOWN_CODES_RECORD,
  UNKNOWN_KIND_RECORD,
} from './squad-record.mock';

describe('serializeSquad', () => {
  it('stores the name and the Units with items as their codes', () => {
    const record = serializeSquad(SQUAD);

    expect(record).toEqual(SQUAD_RECORD);
  });

  it('keeps no Officer mark', () => {
    const record = serializeSquad({ ...SQUAD, units: [BIOSOLDIER_UNIT] });

    expect(record.units[0]).not.toHaveProperty('isOfficer');
  });
});

describe('parseSquad', () => {
  it('restores the Squad with its id, name and Units', () => {
    const squad = parseSquad(SQUAD_ID, SQUAD_RECORD);

    expect(squad).toEqual(SQUAD);
  });

  it('returns null for a record of another shape', () => {
    const squad = parseSquad(SQUAD_ID, { name: 'Alpha', units: 'none' });

    expect(squad).toBeNull();
  });

  it('returns null for a record that is not an object', () => {
    const squad = parseSquad(SQUAD_ID, null);

    expect(squad).toBeNull();
  });

  it('drops an invalid Unit and keeps the others', () => {
    const squad = parseSquad(SQUAD_ID, { name: 'Alpha', units: [INVALID_UNIT_RECORD, SHIV_RECORD] });

    expect(squad?.units).toEqual([SHIV_UNIT]);
  });

  it('drops a Unit of an unknown build kind', () => {
    const squad = parseSquad(SQUAD_ID, { name: 'Alpha', units: [UNKNOWN_KIND_RECORD, SHIV_RECORD] });

    expect(squad?.units).toEqual([SHIV_UNIT]);
  });

  it('leaves the slots of unknown item codes empty', () => {
    const squad = parseSquad(SQUAD_ID, { name: 'Alpha', units: [UNKNOWN_CODES_RECORD] });

    expect(squad?.units[0]?.loadout).toEqual(UNKNOWN_CODES_LOADOUT);
  });

  it('drops the old Officer mark of a Unit', () => {
    const squad = parseSquad(SQUAD_ID, { name: 'Alpha', units: [OFFICER_MARK_RECORD] });

    expect(squad?.units[0]).not.toHaveProperty('isOfficer');
  });

  it('reads the SHIV type code of a SHIV from the SHIV type catalog', () => {
    const squad = parseSquad(SQUAD_ID, { name: 'Alpha', units: [SHIV_RECORD] });

    expect(squad?.units[0]?.loadout.armor).toBe('shiv');
  });
});
