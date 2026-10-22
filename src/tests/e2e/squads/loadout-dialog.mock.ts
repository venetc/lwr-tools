import type { SeededUnit } from '../utils/squads';

export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const SNIPER = 'Sniper';

export const GUNNER = 'Gunner';

export const ARMOR_TILE = 'Armor: Tactical Vest';

export const PRIMARY_TILE = 'Primary: Assault Rifle';

export const SECONDARY_TILE = 'Secondary: Empty';

export const EMPTY_UTILITY_TILE = 'Utility: Empty';

export const GRENADE_TILE = 'Utility: HE Grenade';

export const EMPTY_GEAR_SLOT_TILE = 'Gear Slot: Empty';

export const ARCHANGEL_TILE = 'Armor: Archangel Armor';

export const LASER_RIFLE_TILE = 'Primary: Laser Rifle';

export const ARMOR_LOCKER = `
- list "Locker":
  - listitem:
    - button "Tactical Vest, Equipped"
  - listitem:
    - button "Archangel Armor"
  - listitem:
    - button "Seraph Armor, Needs officer"
  - listitem:
    - button "Ghost Armor, Needs Gene mod"
  - listitem:
    - button "Aurora Armor, Needs Psionic ability"
  - listitem:
    - button "Vortex Armor, Needs Psionic ability"
`;

export const EQUIPPED_VEST = 'Tactical Vest, Equipped';

export const GHOST_BLOCKED = 'Ghost Armor, Needs Gene mod';

export const GHOST = 'Ghost Armor';

export const HE_GRENADE = 'HE Grenade';

export const HE_GRENADE_EQUIPPED = 'HE Grenade, Equipped';

export const HE_GRENADE_TWICE = 'HE Grenade, MAX 1 PER SOLDIER';

export const HE_GRENADE_IN_GEAR_SLOT = 'HE Grenade, Gear Slot: passive gear only';

export const CERAMIC_STACKED = 'Ceramic Plating, CAN\'T STACK';

export const SCANNER_OF_SCOUT = 'Battle Scanner, CLASS-LIMITED ITEM';

export const PSI_GRENADE_BLOCKED = 'Psi Grenade, Needs Psionic ability';

export const CHITIN_BLOCKED = 'Chitin Plating, Needs Gene mod';

export const CHITIN_REASONS = `
- list "Reasons":
  - listitem: Needs Gene mod
  - listitem: CAN'T STACK
`;

export const SCANNER_CARRIERS = 'Carriers Scout';

export const PISTOL = 'Pistol';

export const PISTOL_EQUIPPED = 'Pistol, Equipped';

export const LMG = 'LMG';

export const TACTICAL_VEST = 'Tactical Vest';

export const ASSAULT_RIFLE = 'Assault Rifle';

export const ARCHANGEL = 'Archangel Armor';

export const VEST_FORMULA = 'Tactical Vest 2 + Tactical Rigging 1 = 3 Utility slots.';

export const ARCHANGEL_FORMULA = 'Archangel Armor 3 + Tactical Rigging 1 = 4 Utility slots, last two are Gear Slots.';

export const SHRUNK_TOAST = 'Utility slots: 4 → 3. Respirator Implant removed: slot removed.';

export const MOVED_TOAST = 'Utility slots: 3 → 4. Smoke Grenade moved to Utility. Medikit removed: Gear Slot takes passive gear only.';

export const LMG_TOAST = 'Utility slots: 3 → 2.';

export const REAPER_TOAST = 'Reaper Ammo removed: unsupported weapon.';

export const GENE_MODS_TAB = /^Gene mods, /;

export const CLASS_TREE_TAB = /^Class tree, /;

export const OFFICER_TAB = /^Officer, /;

/** Perks of Lance Corporal and Corporal of the default Sniper build, the ranks Lieutenant requires. */
export const LIEUTENANT_PERKS = ['Magnum', 'Sharpshooter'];

/** Officer perk of Lieutenant. */
export const STRENGTH_IN_NUMBERS = 'Strength in Numbers';

export const SERAPH = 'Seraph Armor';

export const SERAPH_BLOCKED = 'Seraph Armor, Needs officer';

export const OFFICER_MARK = /Officer/;

/** Gene mod of the Skin of any default biosoldier build. */
export const ENHANCED_METABOLISM = 'Enhanced Metabolism';

export const GRENADE_SNIPER: SeededUnit = {
  id: 'grenade',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 1, primary: 1, secondary: null, utility: [1, null, null], modules: [] },
};

export const ALLOY_SNIPER: SeededUnit = {
  id: 'alloy',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 1, primary: 1, secondary: null, utility: [14, null, null], modules: [] },
};

export const ARCHANGEL_SNIPER: SeededUnit = {
  id: 'archangel',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 11, primary: 1, secondary: null, utility: [null, null, null, null], modules: [] },
};

export const PLATED_ARCHANGEL_SNIPER: SeededUnit = {
  id: 'plated-archangel',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 11, primary: 1, secondary: null, utility: [1, 4, 14, 16], modules: [] },
};

export const GRENADIER_SNIPER: SeededUnit = {
  id: 'grenadier',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 1, primary: 1, secondary: null, utility: [1, 4, 11], modules: [] },
};

export const REAPER_SNIPER: SeededUnit = {
  id: 'reaper',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 1, primary: 17, secondary: null, utility: [48, null, null], modules: [] },
};

export const PISTOL_SNIPER: SeededUnit = {
  id: 'pistol',
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 1, primary: 1, secondary: 13, utility: [null, null, null], modules: [] },
};

export const PISTOL_TILE = 'Secondary: Pistol';
