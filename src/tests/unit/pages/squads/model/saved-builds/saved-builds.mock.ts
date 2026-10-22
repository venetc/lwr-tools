import type { SoldierClass } from '@entities/soldier';
import type { SquadUnit } from '@features/manage-squads/model/squad';
import type { SquadBuild } from '@pages/squads/model/squad-build';

/**
 * Class with only the fields the Squad planner reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: SoldierClass['id'], name: string) => ({ id, name } as SoldierClass);

/**
 * Biosoldier build without gene mods and psionic abilities.
 *
 * @param id build id.
 * @param name build name.
 * @param soldierClass class of the build.
 */
const biosoldierBuildMock = (id: string, name: string, soldierClass: SoldierClass): SquadBuild => ({
  kind: 'biosoldier',
  build: { id, name, readonly: false, soldierClass, perks: [], geneMods: [], psionicAbilities: [], officerPerks: [] },
});

export const OVERWATCH_SNIPER = biosoldierBuildMock('sniper-build', 'Overwatch Sniper', soldierClassMock('sniper', 'Sniper'));

export const FIELD_MEDIC = biosoldierBuildMock('medic-build', 'Field Medic', soldierClassMock('medic', 'Medic'));

export const GOLIATH_WALL: SquadBuild = {
  kind: 'mec',
  build: { id: 'mec-build', name: 'Goliath Wall', readonly: false, soldierClass: soldierClassMock('goliath', 'Goliath'), perks: [] },
};

export const ALLOY_SUPPORT: SquadBuild = {
  kind: 'shiv',
  build: { id: 'shiv-build', name: 'Alloy Support', readonly: false, perks: [] },
};

export const BUILDS = [OVERWATCH_SNIPER, FIELD_MEDIC, GOLIATH_WALL, ALLOY_SUPPORT];

/**
 * Unit of the build with an empty Loadout.
 *
 * @param id Unit id.
 * @param build build of the Unit.
 */
const unitMock = (id: string, build: SquadUnit['build']): SquadUnit => ({
  id,
  build,
  isOfficer: false,
  loadout: { armor: null, primary: null, secondary: null, utility: [], modules: [] },
});

export const UNITS = [
  unitMock('first', { kind: 'biosoldier', id: 'sniper-build' }),
  unitMock('second', { kind: 'mec', id: 'mec-build' }),
  unitMock('third', { kind: 'biosoldier', id: 'sniper-build' }),
];

export const FILTER_COUNTS = [4, 2, 1, 1];

export const FILTER_NAMES = ['All', 'Biosoldier', 'MEC', 'SHIV'];

export const GROUP_TITLES = ['Biosoldier builds', 'MEC builds', 'SHIV builds'];

export const IN_SQUAD_COUNTS = [2, 0];
