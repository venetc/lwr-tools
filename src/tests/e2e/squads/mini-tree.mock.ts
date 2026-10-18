export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const MEC_BUILDS = 'MEC builds';

export const SHIV_BUILDS = 'SHIV builds';

export const BIOSOLDIER_PATH = '/builds/biosoldier';

export const SNIPER = 'Sniper';

export const JAEGER = 'Jaeger';

export const SHIV = 'SHIV';

/** Accessible names of the mini-tree rows of any unit type. */
export const MINI_TREE_ROWS = /^(Class tree|Gene mods|Psionic|SHIV tree)$/;

export const SNIPER_ROWS = `
- list "Class tree"
- list "Gene mods":
  - 'listitem "Brain: Empty"'
- list "Psionic"
- list "Loadout"
`;

export const MEC_ROW = 'Class tree';

export const SHIV_ROW = 'SHIV tree';

/** Base perk of a Sniper, selected in every build. */
export const SQUADSIGHT_STEP = 'Specialist: Squadsight';

/** Lance Corporal, the rank open in a default build. */
export const OPEN_RANK_STEP = 'Lance Corporal: Empty';

/** Corporal, locked in a default build. */
export const LOCKED_RANK_STEP = 'Corporal: Locked';

/** Perk of Lance Corporal of a Sniper. */
export const MAGNUM = 'Magnum';

export const MAGNUM_STEP = 'Lance Corporal: Magnum';
