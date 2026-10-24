import type { SeededUnit } from '../utils/squads';

export const BIOSOLDIER_STORAGE_PREFIX = 'lwr-tools.biosoldier-builds.v1.';

export const MEC_STORAGE_PREFIX = 'lwr-tools.mec-builds.v1.';

export const SHIV_STORAGE_PREFIX = 'lwr-tools.shiv-builds.v1.';

export const BIOSOLDIER_PATH = '/builds/biosoldier';

/**
 * Stored Outdated Sniper build: Sharpshooter on Lance Corporal, Advanced Perception on Brain, Psi Mastery on Awakened
 * and Cover Tactics on Lieutenant no longer fit their steps; Lone Wolf on Master Sergeant and Iron Skin on Skin do.
 */
export const OUTDATED_SNIPER_BUILD = { id: 'outdated-sniper', code: 'AQiIOh2FIRhqy-bIIErW8ChGzoAA1w', readonly: false };

/** Stored Outdated Jaeger build: Sharpshooter on Lance Corporal no longer fits its rank. */
export const OUTDATED_JAEGER_BUILD = { id: 'outdated-jaeger', code: 'AwiJOh2IQgBs', readonly: false };

/** Stored Outdated SHIV build: Lock N' Load and Repair Servos share Basic Config. */
export const OUTDATED_SHIV_BUILD = { id: 'outdated-shiv', code: 'AghVgiBATQ', readonly: false };

export const SNIPER = 'Sniper';

export const JAEGER = 'Jaeger';

export const SHIV = 'SHIV';

/** Sniper of the Outdated build in Seraph Armor, which needs an officer: the Unit check would replace it. */
export const SERAPH_SNIPER: SeededUnit = {
  id: 'seraph',
  build: { kind: 'biosoldier', id: 'outdated-sniper' },
  loadout: { armor: 10, primary: 1, secondary: null, utility: [null, null, null, null, null], modules: [] },
};

export const JAEGER_UNIT: SeededUnit = {
  id: 'jaeger',
  build: { kind: 'mec', id: 'outdated-jaeger' },
  loadout: { armor: 18, primary: 10, secondary: null, utility: [null, null, null], modules: [null, null, null] },
};

export const SHIV_UNIT: SeededUnit = {
  id: 'shiv',
  build: { kind: 'shiv', id: 'outdated-shiv' },
  loadout: { armor: 2, primary: 11, secondary: null, utility: [null, null, null, null], modules: [] },
};

/** Storage key of the seeded Squad. */
export const SEEDED_SQUAD_KEY = 'lwr-tools.squads.v1.squad.seeded';

/** Catalog code of Seraph Armor. */
export const SERAPH_ARMOR_CODE = 10;

export const OUTDATED_CAPTION = 'Build outdated · update it in the Build';

export const SNIPER_CAPTION = 'Biosoldier · Sniper';

export const SERAPH_TILE = 'Armor: Seraph Armor';

export const LOADOUT_DIALOG = 'Loadout';

export const TACTICAL_VEST_TILE = 'Armor: Tactical Vest';

export const TOAST_TITLE = 'Loadouts updated';

export const SERAPH_REPLACED = 'Sniper — Seraph Armor replaced with Tactical Vest: needs officer.';

/** Steps of the mini-trees with the abilities of the code. */
export const SNIPER_OUTDATED_STEP = 'Lance Corporal: Sharpshooter, outdated selection';

export const JAEGER_OUTDATED_STEP = 'Lance Corporal: Sharpshooter, outdated selection';

export const SHIV_OUTDATED_STEP = 'Basic Config: Lock N\' Load and Repair Servos, outdated selections';

/** Step of the mini-tree with a selection the code keeps. */
export const LONE_WOLF_STEP = 'Master Sergeant: Lone Wolf';

/** Step of the mini-tree after the update: the outdated selection is cleared. */
export const CLEARED_STEP = 'Lance Corporal: Empty';

export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const UPDATE_HINT = 'Update the build first';

export const OUTDATED_CHIP = '4 outdated selections';

export const UPDATE_LABEL = 'Update';

export const UPDATE_DIALOG = 'Update build';

export const UNIT_BLOCK_TITLE = 'Unit code not copied';

export const UNIT_BLOCK_TEXT = 'Sniper is outdated. Update it in the Build first.';

export const SQUAD_BLOCK_TITLE = 'Squad code not copied';

export const SQUAD_BLOCK_TEXT = 'Outdated builds: Sniper, Jaeger. Update them in the Build first.';

export const SQUAD_CODE_LABEL = 'Share code';
