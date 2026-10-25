export const PAGE_PATH = '/builds/biosoldier';

export const PANEL_NAME = 'Sniper';

export const SHIV_PAGE_PATH = '/builds/shiv';

export const SHIV_PANEL_NAME = 'SHIV';

/** Perk of Lance Corporal, the rank open in a default build. */
export const MAGNUM = 'Magnum';

/** Perk of Corporal, the rank Lieutenant requires. */
export const SHARPSHOOTER = 'Sharpshooter';

export const GENE_MODS_TAB = /^Gene mods, /;

export const GENE_MODS_TAB_WITH_ONE = 'Gene mods, 1 of 5';

export const IRON_SKIN = 'Iron Skin';

export const PSIONIC_TAB = /^Psionic, /;

export const PSIONIC_TAB_WITH_ONE = 'Psionic, 1 of 5';

export const COUNTERCHARGE = 'Countercharge';

export const OFFICER_TAB = /^Officer, /;

export const OFFICER_TAB_WITH_ONE = 'Officer, 1 of 5';

export const STRENGTH_IN_NUMBERS = 'Strength in Numbers';

export const RENAME_LABEL = 'Rename build';

export const EXPORTED_NAME = 'Exported sniper';

export const EXPORT_LABEL = 'Share build';

export const REPLACE_LABEL = 'Import build';

export const COPY_LABEL = 'Copy';

export const COPIED_LABEL = 'Copied';

export const BROKEN_CODE = 'not-a-share-code';

export const INVALID_CODE_ERROR = 'Invalid code';

export const NOTIFICATIONS = /^Notifications/;

export const SHIV_CODE_TITLE = 'This is a SHIV build code';

export const BIOSOLDIER_CODE_TITLE = 'This is a Biosoldier build code';

/**
 * Sniper build code from an older mod version: Sharpshooter on Lance Corporal, Advanced Perception on Brain, Psi
 * Mastery on Awakened and Cover Tactics on Lieutenant no longer fit their steps; Lone Wolf on Master Sergeant and Iron
 * Skin on Skin do.
 */
export const OUTDATED_BUILD_CODE = 'AQiIOh2FIRhqy-bIIErW8ChGzoAA1w';

/** Sniper Unit code with the selections of `OUTDATED_BUILD_CODE` and an empty Loadout. */
export const OUTDATED_UNIT_CODE = 'AQiIOh2FIRhqy-bIIErW8ChGzoBg6AAAAAAr';

/** Cards of `OUTDATED_BUILD_CODE`: the step, the ability of the code and the one the tree has there now. */
export const OUTDATED_CARD_TEXTS = [
  /Class tree.*Lance Corporal.*Sharpshooter.*Magnum/,
  /Gene mods.*Brain.*Advanced Perception.*Neural Damping/,
  /Psionic.*Awakened.*Psi Mastery.*Mind Fray/,
  /Officer.*Lieutenant.*Cover Tactics.*Strength in Numbers/,
];

/** Perk of Master Sergeant that `OUTDATED_BUILD_CODE` keeps. */
export const LONE_WOLF = 'Lone Wolf';

export const CANCEL_LABEL = 'Cancel';

export const IMPORT_LABEL = 'Import';

export const CODE_LABEL = 'Code';
