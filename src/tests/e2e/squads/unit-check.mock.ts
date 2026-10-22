import type { SeededUnit } from '../utils/squads';

export const BIOSOLDIER_PATH = '/builds/biosoldier';

export const SNIPER = 'Sniper';

export const SEEDED_SQUAD = 'Seeded';

/** Storage key of the seeded Squad. */
export const SEEDED_SQUAD_KEY = 'lwr-tools.squads.v1.squad.seeded';

export const CLASS_TREE_TAB = /^Class tree, /;

export const PSIONIC_TAB = /^Psionic, /;

export const GENE_MODS_TAB = /^Gene mods, /;

export const OFFICER_TAB = /^Officer, /;

/** Psionic ability of Awakened, which Aurora Armor needs. */
export const COUNTERCHARGE = 'Countercharge';

/** Perks of Lance Corporal and Corporal, the ranks Lieutenant requires. */
export const CLASS_PERKS = ['Magnum', 'Sharpshooter'];

/** Officer perk of Lieutenant. */
export const STRENGTH_IN_NUMBERS = 'Strength in Numbers';

export const IRON_SKIN = 'Iron Skin';

export const TOAST_TITLE = 'Loadouts updated';

export const CLOSE_NOTE_TITLE = 'On close';

export const AURORA_REPLACED = 'Sniper — Aurora Armor replaced with Tactical Vest: needs Psionic ability.';

export const SERAPH_REPLACED = 'Sniper — Seraph Armor replaced with Tactical Vest: needs officer.';

export const SERAPH_REPLACED_TWICE = 'Sniper (2 Units) — Seraph Armor replaced with Tactical Vest: needs officer.';

export const BUILD_NOT_FOUND = '1 Unit removed: Build not found';

export const SERAPH_TILE = 'Armor: Seraph Armor';

export const TACTICAL_VEST_TILE = 'Armor: Tactical Vest';

export const REMOVE_BUILD_LABEL = 'Remove build';

/** Time the remove button is held, in milliseconds: longer than the hold it needs. */
export const REMOVE_HOLD_TIME = 700;

/** Catalog code of Tactical Vest. */
export const TACTICAL_VEST_CODE = 1;

export const AURORA_SNIPER: SeededUnit = {
  id: 'aurora',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 13, primary: 1, secondary: null, utility: [null, null, null, null], modules: [] },
};

export const SERAPH_SNIPER: SeededUnit = {
  id: 'seraph',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 10, primary: 1, secondary: null, utility: [null, null, null, null, null], modules: [] },
};

export const SECOND_SERAPH_SNIPER: SeededUnit = { ...SERAPH_SNIPER, id: 'second-seraph' };

export const TACTICAL_VEST_SNIPER: SeededUnit = {
  id: 'tactical-vest',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 1, primary: 1, secondary: null, utility: [null, null, null], modules: [] },
};

export const LOST_UNIT: SeededUnit = {
  id: 'lost',
  build: { kind: 'biosoldier', id: 'deleted-build' },
  loadout: { armor: 1, primary: 1, secondary: null, utility: [null, null, null], modules: [] },
};
