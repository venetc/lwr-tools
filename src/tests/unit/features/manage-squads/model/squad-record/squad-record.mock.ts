import type { Squad, SquadUnit, UnitLoadout } from '@features/manage-squads';

export const SQUAD_ID = 'squad-1';

export const UNKNOWN_CODE = 999;

export const BIOSOLDIER_RECORD = {
  id: 'unit-1',
  build: { kind: 'biosoldier', id: 'build-1' },
  isOfficer: true,
  loadout: { armor: 1, primary: 1, secondary: null, utility: [1, null], modules: [] },
};

export const BIOSOLDIER_UNIT: SquadUnit = {
  id: 'unit-1',
  build: { kind: 'biosoldier', id: 'build-1' },
  isOfficer: true,
  loadout: { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: ['he-grenade', null], modules: [] },
};

export const SHIV_RECORD = {
  id: 'unit-2',
  build: { kind: 'shiv', id: 'build-2' },
  loadout: { armor: 1, primary: 1, secondary: null, utility: [], modules: [] },
};

export const SHIV_UNIT: SquadUnit = {
  id: 'unit-2',
  build: { kind: 'shiv', id: 'build-2' },
  isOfficer: false,
  loadout: { armor: 'shiv', primary: 'assault-rifle', secondary: null, utility: [], modules: [] },
};

export const SQUAD_RECORD = { name: 'Alpha', units: [BIOSOLDIER_RECORD, SHIV_RECORD] };

export const SQUAD: Squad = { id: SQUAD_ID, name: 'Alpha', units: [BIOSOLDIER_UNIT, SHIV_UNIT] };

export const MEC_OFFICER_RECORD = { ...BIOSOLDIER_RECORD, build: { kind: 'mec', id: 'build-3' } };

export const MEC_OFFICER_UNIT: SquadUnit = { ...BIOSOLDIER_UNIT, build: { kind: 'mec', id: 'build-3' }, isOfficer: false };

export const UNKNOWN_KIND_RECORD = { ...BIOSOLDIER_RECORD, build: { kind: 'tank', id: 'build-4' } };

export const INVALID_UNIT_RECORD = { ...BIOSOLDIER_RECORD, loadout: { ...BIOSOLDIER_RECORD.loadout, utility: 'none' } };

export const UNKNOWN_CODES_RECORD = {
  ...BIOSOLDIER_RECORD,
  loadout: { armor: UNKNOWN_CODE, primary: UNKNOWN_CODE, secondary: UNKNOWN_CODE, utility: [UNKNOWN_CODE, 1], modules: [] },
};

export const UNKNOWN_CODES_LOADOUT: UnitLoadout = { armor: null, primary: null, secondary: null, utility: [null, 'he-grenade'], modules: [] };
