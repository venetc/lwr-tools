import type { Loadout, LoadoutChange, LoadoutItemId, LoadoutUnit } from '@entities/loadout';
import { defaultShivBuild } from '@entities/shiv/model/build';
import { BIOSOLDIER_CLASSES } from '@entities/soldier';
import { defaultBiosoldierBuild } from '@entities/soldier/model/build';
import type { SquadUnitBuild } from '@features/manage-squads';
import type { DecodedSquadBuild } from '@features/share-build';

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

export const LOADOUT_UNITS_STUB: LoadoutUnit[] = [
  { id: 'biosoldier', code: 1, name: 'Biosoldier' },
  { id: 'mec', code: 2, name: 'MEC' },
  { id: 'shiv', code: 3, name: 'SHIV' },
];

/** Names of the items of the mock changes. */
const ITEM_NAMES = new Map<LoadoutItemId, string>([
  ['seraph-armor', 'Seraph Armor'],
  ['tactical-vest', 'Tactical Vest'],
]);

/**
 * Stub of `findLoadoutItem` that knows only the names of the mock items.
 *
 * @param id item id.
 */
export const findLoadoutItemStub = (id: LoadoutItemId) => {
  const name = ITEM_NAMES.get(id) ?? null;

  return name ? { item: { name } } : null;
};

export const SQUAD_NAME = 'Alpha';

export const BIOSOLDIER_SQUAD_BUILD: DecodedSquadBuild = { kind: 'biosoldier', build: { ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS), name: 'Overwatch' } };

export const SHIV_SQUAD_BUILD: DecodedSquadBuild = { kind: 'shiv', build: { ...defaultShivBuild(), name: 'Tank' } };

export const DEFAULT_LOADOUT: Loadout = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: 'pistol', utility: [null], modules: [] };

export const SERAPH_LOADOUT: Loadout = { ...DEFAULT_LOADOUT, armor: 'seraph-armor' };

export const SERAPH_REPLACED: LoadoutChange = { kind: 'replaced', slot: 'armor', item: 'seraph-armor', by: 'tactical-vest', reason: 'needs-officer' };

export const FIRST_BIOSOLDIER_BUILD: SquadUnitBuild = { kind: 'biosoldier', id: 'biosoldier-1' };

export const SECOND_BIOSOLDIER_BUILD: SquadUnitBuild = { kind: 'biosoldier', id: 'biosoldier-2' };

export const SHIV_BUILD: SquadUnitBuild = { kind: 'shiv', id: 'shiv-1' };

export const IMPORTED_UNITS = [
  { build: FIRST_BIOSOLDIER_BUILD, buildName: 'Overwatch', loadout: DEFAULT_LOADOUT, changes: [] },
  { build: FIRST_BIOSOLDIER_BUILD, buildName: 'Overwatch', loadout: DEFAULT_LOADOUT, changes: [] },
  { build: SECOND_BIOSOLDIER_BUILD, buildName: 'Sniper', loadout: DEFAULT_LOADOUT, changes: [] },
  { build: SHIV_BUILD, buildName: 'Tank', loadout: DEFAULT_LOADOUT, changes: [] },
];

export const CHANGED_UNITS = [
  { build: FIRST_BIOSOLDIER_BUILD, buildName: 'Overwatch', loadout: DEFAULT_LOADOUT, changes: [SERAPH_REPLACED] },
  { build: FIRST_BIOSOLDIER_BUILD, buildName: 'Overwatch', loadout: DEFAULT_LOADOUT, changes: [SERAPH_REPLACED] },
];

export const COUNTS_TOAST = { title: 'Squad imported', description: 'Alpha opened with new Builds: 2 in Biosoldier builds, 1 in SHIV builds.' };

export const CHANGES_TOAST = {
  title: 'Squad imported',
  description: 'Alpha opened with new Builds: 1 in Biosoldier builds.\nOverwatch (2 Units) — Seraph Armor replaced with Tactical Vest: needs officer.',
};

export const EMPTY_SQUAD_TOAST = { title: 'Squad imported', description: 'Alpha opened.' };
