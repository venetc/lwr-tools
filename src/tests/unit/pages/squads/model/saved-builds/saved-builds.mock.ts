import type { SoldierBuildData, SoldierClass } from '@entities/soldier';
import type { SquadUnit } from '@features/manage-squads';
import type { SquadBuild } from '@pages/squads/model/squad-build';

/**
 * Class with only the fields the Squad planner reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: SoldierClass['id'], name: string) => ({ id, name } as SoldierClass);

/** Names of the perks the Signature skills of the mock builds refer to. */
const PERK_NAMES = new Map([
  ['in-the-zone', 'In The Zone'],
  ['lone-wolf', 'Lone Wolf'],
]);

/**
 * Stub of `soldierBuildSignatureSkill` that knows only the names of the perks of the mock.
 *
 * @param build soldier build.
 */
export const soldierBuildSignatureSkillStub = (build: Readonly<SoldierBuildData>) => {
  const name = build.signatureSkill ? PERK_NAMES.get(build.signatureSkill) : null;

  return name ? { name } : null;
};

/**
 * Biosoldier build without gene mods and psionic abilities.
 *
 * @param id build id.
 * @param name build name.
 * @param soldierClass class of the build.
 * @param signatureSkill Signature skill id; null for none.
 * @param perks selected perks by rank.
 */
const biosoldierBuildMock = (id: string, name: string, soldierClass: SoldierClass, signatureSkill: string | null = null, perks: string[] = []): SquadBuild => ({
  kind: 'biosoldier',
  build: {
    id,
    name,
    readonly: false,
    outdated: null,
    soldierClass,
    perks: perks as SoldierBuildData['perks'],
    signatureSkill: signatureSkill as SoldierBuildData['signatureSkill'],
    geneMods: [],
    psionicAbilities: [],
    officerPerks: [],
  },
});

export const OVERWATCH_SNIPER = biosoldierBuildMock('sniper-build', 'Overwatch Sniper', soldierClassMock('sniper', 'Sniper'), 'in-the-zone');

export const FIELD_MEDIC = biosoldierBuildMock('medic-build', 'Field Medic', soldierClassMock('medic', 'Medic'));

export const GOLIATH_WALL: SquadBuild = {
  kind: 'mec',
  build: { id: 'mec-build', name: 'Goliath Wall', readonly: false, outdated: null, soldierClass: soldierClassMock('goliath', 'Goliath'), perks: [], signatureSkill: null },
};

export const ALLOY_SUPPORT: SquadBuild = {
  kind: 'shiv',
  build: { id: 'shiv-build', name: 'Alloy Support', readonly: false, outdated: null, perks: [] },
};

export const OLD_SUPPORT: SquadBuild = {
  kind: 'shiv',
  build: { id: 'old-shiv-build', name: 'Old Support', readonly: false, outdated: { code: 'old-code', selections: [] }, perks: [] },
};

export const BUILDS = [OVERWATCH_SNIPER, FIELD_MEDIC, GOLIATH_WALL, ALLOY_SUPPORT];

/** Biosoldier build with Lone Wolf selected but without a Signature skill. */
export const LONE_SCOUT = biosoldierBuildMock('scout-build', 'Lone Scout', soldierClassMock('scout', 'Scout'), null, ['lone-wolf']);

/** SHIV build whose data carries a Signature skill, as a soldier build would: a SHIV has none, so it is not searched. */
export const LONE_SHIV = {
  kind: 'shiv',
  build: { id: 'lone-shiv-build', name: 'Steel Guard', readonly: false, outdated: null, perks: [], signatureSkill: 'lone-wolf' },
} as SquadBuild;

/**
 * Unit of the build with an empty Loadout.
 *
 * @param id Unit id.
 * @param build build of the Unit.
 */
const unitMock = (id: string, build: SquadUnit['build']): SquadUnit => ({
  id,
  build,
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
