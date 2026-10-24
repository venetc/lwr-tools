export const PAGE_PATH = '/builds/biosoldier';

export const PANEL_NAME = 'Sniper';

export const STORAGE_PREFIX = 'lwr-tools.biosoldier-builds.v1.';

/**
 * Sniper build code from an older mod version: Sharpshooter on Lance Corporal, Advanced Perception on Brain, Psi
 * Mastery on Awakened and Cover Tactics on Lieutenant no longer fit their steps; Lone Wolf on Master Sergeant and Iron
 * Skin on Skin do.
 */
const OUTDATED_CODE = 'AQiIOh2FIRhqy-bIIErW8ChGzoAA1w';

/** Stored editable Outdated build of `OUTDATED_CODE`. */
export const OUTDATED_BUILD = { id: 'outdated', code: OUTDATED_CODE, readonly: false };

/** Stored readonly Outdated build of `OUTDATED_CODE`. */
export const READONLY_OUTDATED_BUILD = { id: 'outdated', code: OUTDATED_CODE, readonly: true };

export const NAVIGATION = 'Builds';

export const OUTDATED_MARK = 'Outdated build';

export const OUTDATED_CHIP = '4 outdated selections';

export const UPDATE_LABEL = 'Update';

export const CANCEL_LABEL = 'Cancel';

export const UPDATE_DIALOG = 'Update build';

export const OLD_LABEL = 'OLD';

/** Rank of the outdated Sharpshooter. */
export const LANCE_CORPORAL = 'Lance Corporal';

/** Rank Sharpshooter is offered on now. */
export const CORPORAL = 'Corporal';

/** Perk of Corporal that the code has on Lance Corporal. */
export const SHARPSHOOTER = 'Sharpshooter';

/** Perk the current tree has where the code has Sharpshooter. */
export const MAGNUM = 'Magnum';

/** Perk of Master Sergeant that the code keeps. */
export const LONE_WOLF = 'Lone Wolf';

export const OUTDATED_NOTE = 'Outdated selection: in this mod version Lance Corporal has Magnum here.';

export const PSIONIC_TAB = /^Psionic, /;

/** Psi level of the outdated Psi Mastery. */
export const AWAKENED = 'Awakened';

/** Psionic ability of the code on Awakened. */
export const PSI_MASTERY = 'Psi Mastery';

export const RENAME_LABEL = 'Rename build';

export const EXPORT_LABEL = 'Export build';

export const LOCK_LABEL = 'Lock build';

export const RESET_LABEL = 'Reset build';

export const IMPORT_LABEL = 'Import build';

/** Cards of the update: the step, the ability of the code and the empty cell. */
export const UPDATE_CARD_TEXTS = [
  /Class tree.*Lance Corporal.*Sharpshooter.*Empty/,
  /Gene mods.*Brain.*Advanced Perception.*Empty/,
  /Psionic.*Awakened.*Psi Mastery.*Empty/,
  /Officer.*Lieutenant.*Cover Tactics.*Empty/,
];
