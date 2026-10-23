import type { SeededUnit } from '../utils/squads';

export const MEC_BUILDS = 'MEC builds';

export const SHIV_BUILDS = 'SHIV builds';

export const JAEGER = 'Jaeger';

export const SHIV = 'SHIV';

export const PALADIN_TILE = 'MEC exoskeleton: MEC1 \'Paladin\'';

export const DAUNTLESS_TILE = 'MEC exoskeleton: HMEC3 \'Dauntless\'';

export const DAUNTLESS = 'HMEC3 \'Dauntless\'';

export const EMPTY_MODULE_TILE = 'Module: Empty';

export const EMPTY_UTILITY_TILE = 'Utility: Empty';

export const DAUNTLESS_INVENTORY = `
- region "Inventory":
  - 'button "MEC exoskeleton: HMEC3 ''Dauntless''"'
  - 'button "Primary: Minigun"'
  - 'button "Module: Empty"'
  - 'button "Module: Empty"'
  - 'button "Module: Empty"'
  - paragraph: HMEC3 'Dauntless' 3 = 3 Utility slots.
  - 'button "Utility: Empty"'
  - 'button "Utility: Empty"'
  - 'button "Utility: Empty"'
`;

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

export const DAUNTLESS_JAEGER: SeededUnit = {
  id: 'dauntless',
  build: { kind: 'mec', id: 'default-jaeger' },
  loadout: { armor: 18, primary: 10, secondary: null, utility: [null, null, null], modules: [null, null, null] },
};

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
