import type { DecodedLoadout, Loadout, LoadoutChange, LoadoutFit, LoadoutItemId, LoadoutUnitId, LoadoutWearer } from '@entities/loadout';
import type { SelectedGeneMods, SelectedOfficerPerks, SelectedPsionicAbilities, SoldierClass } from '@entities/soldier';
import type { SquadUnit } from '@features/manage-squads';
import type { SquadBuild } from '@pages/squads/model/squad-build';

/** Names of the items the toast lines tell. */
const ITEM_NAMES = new Map<LoadoutItemId, string>([
  ['tactical-vest', 'Vest'],
  ['seraph-armor', 'Seraph'],
  ['psi-grenade', 'Grenade'],
]);

/**
 * Stub of `findLoadoutItem` that knows only the names of the items of the mock.
 *
 * @param id item id.
 */
export const findLoadoutItemStub = (id: LoadoutItemId) => {
  const name = ITEM_NAMES.get(id) ?? null;

  return name ? { item: { name } } : null;
};

export const SNIPER_DEFAULT_LOADOUT: Loadout = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] };

export const MEC_DEFAULT_LOADOUT: Loadout = { armor: 'mec1-paladin', primary: 'minigun', secondary: null, utility: [null], modules: [null] };

/** Default Loadout of each unit type. */
const DEFAULT_LOADOUTS = new Map<LoadoutUnitId, Loadout>([
  ['biosoldier', SNIPER_DEFAULT_LOADOUT],
  ['mec', MEC_DEFAULT_LOADOUT],
  ['shiv', { armor: 'shiv', primary: 'autocannon', secondary: null, utility: [null, null], modules: [] }],
]);

/**
 * Stub of `defaultLoadout`: the Default Loadout of the unit type of the wearer.
 *
 * @param wearer profile of the Unit.
 */
export const defaultLoadoutStub = (wearer: LoadoutWearer) => DEFAULT_LOADOUTS.get(wearer.unit) ?? null;

/**
 * Stub of `fitLoadout` that keeps the Loadout as it is.
 *
 * @param loadout Loadout to fit.
 */
export const keepingFitStub = (loadout: Loadout): LoadoutFit => ({ loadout, changes: [] });

/**
 * Class with only the fields the Squad planner reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: SoldierClass['id'], name: string) => ({ id, name } as SoldierClass);

/**
 * Biosoldier build of the Sniper class.
 *
 * @param build fields that differ from a build without gene mods, psionic abilities and officer perks.
 * @param build.geneMods gene mods by body part.
 * @param build.psionicAbilities psionic abilities by psi level.
 * @param build.officerPerks officer perks by officer rank.
 */
export const createBiosoldierBuildMock = (
  build: { geneMods?: SelectedGeneMods, psionicAbilities?: SelectedPsionicAbilities, officerPerks?: SelectedOfficerPerks } = {},
): SquadBuild => ({
  kind: 'biosoldier',
  build: {
    id: 'sniper-build',
    name: 'Overwatch Sniper',
    readonly: false,
    soldierClass: soldierClassMock('sniper', 'Sniper'),
    perks: [],
    geneMods: build.geneMods ?? [null, null, null, null, null],
    psionicAbilities: build.psionicAbilities ?? [],
    officerPerks: build.officerPerks ?? [],
  },
});

export const MEC_BUILD: SquadBuild = {
  kind: 'mec',
  build: { id: 'mec-build', name: 'Goliath Wall', readonly: false, soldierClass: soldierClassMock('goliath', 'Goliath'), perks: [] },
};

export const SHIV_BUILD: SquadBuild = {
  kind: 'shiv',
  build: { id: 'shiv-build', name: 'Alloy Support', readonly: false, perks: [] },
};

export const GENE_MODS: SelectedGeneMods = [null, 'ram', null, null, null];

export const PSIONIC_ABILITIES: SelectedPsionicAbilities = ['mind-fray'];

export const OFFICER_PERKS: SelectedOfficerPerks = ['stay-frosty'];

export const SNIPER_WEARER = { unit: 'biosoldier', classId: 'sniper', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const MEC_WEARER = { unit: 'mec', classId: 'goliath', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SHIV_WEARER = { unit: 'shiv', classId: null, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const UNKNOWN_CODES_LOADOUT: DecodedLoadout = { armor: null, primary: null, secondary: null, utility: [null, null, null], modules: [] };

export const SERAPH_LOADOUT: DecodedLoadout = { armor: 'seraph-armor', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] };

export const SERAPH_REPLACED: LoadoutChange[] = [{ kind: 'replaced', slot: 'armor', item: 'seraph-armor', by: 'tactical-vest', reason: 'needs-officer' }];

export const SERAPH_FIT: LoadoutFit = { loadout: SNIPER_DEFAULT_LOADOUT, changes: SERAPH_REPLACED };

export const SERAPH_AND_GRENADE_FIT: LoadoutFit = {
  loadout: SNIPER_DEFAULT_LOADOUT,
  changes: [...SERAPH_REPLACED, { kind: 'removed', slot: 'utility', item: 'psi-grenade', reason: 'needs-psionic' }],
};

export const MEC_GRENADE_FIT: LoadoutFit = {
  loadout: MEC_DEFAULT_LOADOUT,
  changes: [{ kind: 'removed', slot: 'utility', item: 'psi-grenade', reason: 'wrong-unit' }],
};

export const UNKNOWN_CODES_FIT_INPUT: Loadout = { ...UNKNOWN_CODES_LOADOUT, armor: 'tactical-vest', primary: 'assault-rifle' };

export const SNIPER_UNIT: SquadUnit = { id: 'unit-1', build: { kind: 'biosoldier', id: 'sniper-build' }, loadout: SERAPH_LOADOUT };

export const LOST_UNIT: SquadUnit = { id: 'unit-2', build: { kind: 'mec', id: 'deleted-build' }, loadout: SERAPH_LOADOUT };

export const SQUAD_BUILDS: ReadonlyMap<string, SquadBuild> = new Map([
  ['biosoldier/sniper-build', createBiosoldierBuildMock()],
  ['mec/mec-build', MEC_BUILD],
]);

export const FIT_UNIT: SquadUnit = {
  id: 'unit-3',
  build: { kind: 'biosoldier', id: 'sniper-build' },
  loadout: { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] },
};

export const SECOND_SNIPER_UNIT: SquadUnit = { id: 'unit-4', build: { kind: 'biosoldier', id: 'sniper-build' }, loadout: SERAPH_LOADOUT };

export const GRENADE_UNIT: SquadUnit = {
  id: 'unit-5',
  build: { kind: 'biosoldier', id: 'sniper-build' },
  loadout: { armor: 'seraph-armor', primary: 'assault-rifle', secondary: null, utility: ['psi-grenade', null, null], modules: [] },
};

export const MEC_UNIT: SquadUnit = {
  id: 'unit-6',
  build: { kind: 'mec', id: 'mec-build' },
  loadout: { armor: 'mec1-paladin', primary: 'minigun', secondary: null, utility: ['psi-grenade'], modules: [null] },
};

export const UNKNOWN_CODES_UNIT: SquadUnit = { id: 'unit-7', build: { kind: 'biosoldier', id: 'sniper-build' }, loadout: UNKNOWN_CODES_LOADOUT };

export const SECOND_LOST_UNIT: SquadUnit = { id: 'unit-8', build: { kind: 'shiv', id: 'deleted-build' }, loadout: SERAPH_LOADOUT };

export const TOAST_TITLE = 'Loadouts updated';

export const SNIPER_BUILD_KEY = 'biosoldier/sniper-build';

export const LOST_BUILD_KEY = 'mec/deleted-build';

export const SNIPER_LINE = 'Overwatch Sniper — Seraph replaced with Vest: needs officer.';

export const TWO_SNIPERS_LINE = 'Overwatch Sniper (2 Units) — Seraph replaced with Vest: needs officer.';

export const SNIPERS_IN_ORDER_LINE = 'Overwatch Sniper (2 Units) — Seraph replaced with Vest: needs officer. Grenade removed: needs Psionic ability.';

export const MEC_LINE = 'Goliath Wall — Grenade removed: wrong unit.';

export const ONE_REMOVED_LINE = '1 Unit removed: Build not found';

export const TWO_REMOVED_LINE = '2 Units removed: Build not found';
