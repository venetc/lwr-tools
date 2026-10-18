import type { SeededUnit } from '../utils/squads';

export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const MEC_BUILDS = 'MEC builds';

export const SHIV_BUILDS = 'SHIV builds';

export const SNIPER = 'Sniper';

export const GUNNER = 'Gunner';

export const ROCKETEER = 'Rocketeer';

export const JAEGER = 'Jaeger';

export const SHIV = 'SHIV';

export const SNIPER_TILES = `
- list "Loadout":
  - /children: equal
  - 'listitem "Armor: Tactical Vest"'
  - 'listitem "Primary: Assault Rifle"'
  - 'listitem "Secondary: Empty"'
  - 'listitem "Utility: Empty"'
  - 'listitem "Utility: Empty"'
  - 'listitem "Utility: Empty"'
`;

export const GUNNER_TILES = `
- list "Loadout":
  - /children: equal
  - 'listitem "Armor: Tactical Vest"'
  - 'listitem "Primary: Assault Rifle"'
  - 'listitem "Utility: Empty"'
  - 'listitem "Utility: Empty"'
  - 'listitem "Utility: Empty"'
`;

export const ROCKETEER_SECONDARY = 'Secondary: Rocket Launcher';

export const MEC_TILES = `
- list "Loadout":
  - /children: equal
  - 'listitem "MEC exoskeleton: MEC1 ''Paladin''"'
  - 'listitem "Primary: Minigun"'
  - 'listitem "Module: Empty"'
  - 'listitem "Utility: Empty"'
  - 'listitem "Utility: Empty"'
`;

export const SHIV_TILES = `
- list "Loadout":
  - /children: equal
  - 'listitem "SHIV type: SHIV"'
  - 'listitem "Primary: Autocannon"'
  - 'listitem "Utility: Empty"'
  - 'listitem "Utility: Empty"'
`;

export const EMPTY_UTILITY = 'Utility: Empty';

export const GEAR_MOUNT = 'Gear Mount: Empty';

export const PSI_MOUNT = 'Psi Mount: Empty';

export const ARCHANGEL_SNIPER: SeededUnit = {
  id: 'archangel',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 11, primary: 1, secondary: null, utility: [null, null, null, null], modules: [] },
};

export const AURORA_SNIPER: SeededUnit = {
  id: 'aurora',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 13, primary: 1, secondary: null, utility: [null, null, null, null], modules: [] },
};
