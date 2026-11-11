import type { SeededUnit } from '../utils/squads';

export const MEC_BUILDS = 'MEC builds';

export const SHIV_BUILDS = 'SHIV builds';

export const JAEGER = 'Jaeger';

export const SHIV = 'SHIV';

export const EXOSKELETON_CAPTION = 'MEC exoskeleton';

export const SHIV_TYPE_CAPTION = 'SHIV type';

export const PALADIN_TILE = 'MEC exoskeleton: MEC1 \'Paladin\'';

export const DAUNTLESS = 'HMEC3 \'Dauntless\'';

export const EMPTY_MODULE_TILE = 'Module: Empty';

export const EXOSKELETON_GROUPS = ['Standard armor', 'Heavy armor', 'Light armor', 'Ultra-Heavy armor', 'Ultra-Light armor'];

/** Name of the item list of a Locker without group names. */
export const UNTITLED_GROUP = 'Locker';

export const EMPTY_UTILITY_TILE = 'Utility: Empty';

export const DAUNTLESS_TILES = `
- list "Loadout":
  - /children: equal
  - listitem:
    - 'button "MEC exoskeleton: HMEC3 ''Dauntless''"'
  - listitem:
    - 'button "Primary: Minigun"'
  - listitem:
    - 'button "Module: Empty"'
  - listitem:
    - 'button "Module: Empty"'
  - listitem:
    - 'button "Module: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
  - listitem:
    - 'button "Utility: Empty"'
`;

export const DAUNTLESS_TOAST = 'Module slots: 1 → 3. Utility slots: 2 → 3.';

export const ADVANCED_LAUNCHER_STACKED = 'Advanced Launcher, CAN\'T STACK';

export const THUMPER_BLOCKED = 'The Thumper, Needs Kinetic Strike Module';

export const INCINERATOR_BLOCKED = 'Incinerator Amp, Needs Flamethrower';

export const HEAVY_MAGS = 'Heavy Mags';

export const HEAVY_MAGS_CARRIERS = 'Carriers MEC/SHIV';

export const EXOSKELETON_CARRIERS = 'Carriers MEC';

export const ALLOY_SHIV_TILE = 'SHIV type: Alloy SHIV';

export const SHIV_TYPE = 'SHIV';

export const HOVER_SHIV = 'Hover SHIV';

export const SHIV_TYPE_TILE = 'SHIV type: SHIV';

export const SHIV_TYPE_EQUIPPED = 'SHIV, Equipped';

export const SHIV_TYPE_CARRIERS = 'Carriers SHIV';

export const SHIV_TILES = `
- list "Loadout":
  - /children: equal
  - listitem:
    - 'button "SHIV type: SHIV"'
  - listitem:
    - 'button "Primary: Autocannon"'
  - listitem:
    - 'button "Utility: Core Plating"'
  - listitem:
    - 'button "Utility: Battle Computer"'
`;

export const SHIV_SHRUNK_TOAST = 'Utility slots: 4 → 2. Heavy Mags removed: slot removed. SCOPE removed: slot removed.';

export const LAUNCHER_JAEGER: SeededUnit = {
  id: 'launcher',
  build: { kind: 'mec', id: 'default-jaeger' },
  loadout: { armor: 16, primary: 10, secondary: null, utility: [null, null], modules: [60, null] },
};

export const EQUIPPED_ALLOY_SHIV: SeededUnit = {
  id: 'alloy',
  build: { kind: 'shiv', id: 'default-shiv' },
  loadout: { armor: 2, primary: 11, secondary: null, utility: [43, 41, 42, 47], modules: [] },
};
