import type { SeededUnit } from '../utils/squads';

export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const MEC_BUILDS = 'MEC builds';

export const SHIV_BUILDS = 'SHIV builds';

export const BIOSOLDIER_PATH = '/builds/biosoldier';

export const PSIONIC_TAB = /^Psionic, /;

/** Psionic ability of Awakened, which Aurora Armor needs. */
export const COUNTERCHARGE = 'Countercharge';

export const SNIPER = 'Sniper';

export const GUNNER = 'Gunner';

export const ROCKETEER = 'Rocketeer';

export const JAEGER = 'Jaeger';

export const SHIV = 'SHIV';

export const SNIPER_TILES = `
- list "Loadout":
  - /children: equal
  - listitem:
    - 'button "Armor: Tactical Vest"'
  - listitem:
    - 'button "Primary: Assault Rifle"'
  - listitem:
    - 'button "Secondary: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
`;

export const GUNNER_TILES = `
- list "Loadout":
  - /children: equal
  - listitem:
    - 'button "Armor: Tactical Vest"'
  - listitem:
    - 'button "Primary: Assault Rifle"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
`;

export const ROCKETEER_SECONDARY = 'Secondary: Rocket Launcher';

export const MEC_TILES = `
- list "Loadout":
  - /children: equal
  - listitem:
    - 'button "MEC exoskeleton: MEC1 ''Paladin''"'
  - listitem:
    - 'button "Primary: Minigun"'
  - listitem:
    - 'button "Module: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
`;

export const SHIV_TILES = `
- list "Loadout":
  - /children: equal
  - listitem:
    - 'button "SHIV type: SHIV"'
  - listitem:
    - 'button "Primary: Autocannon"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
`;

export const EMPTY_UTILITY = 'Utility: Empty';

export const GEAR_SLOT = 'Gear Slot: Empty';

export const PSI_SLOT = 'Psi Slot: Empty';

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
