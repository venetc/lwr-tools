export const PAGE_PATH = '/builds/mec';

export const PANEL_NAME = 'Jaeger';

export const STORAGE_PREFIX = 'lwr-tools.mec-builds.v1.';

/**
 * Jaeger build code from an older mod version: Sharpshooter on Lance Corporal no longer fits its rank; Aggression on
 * Sergeant, Killer Instinct on Tech Sergeant, Lone Wolf on Gunnery Sergeant and Sprinter on Master Sergeant do.
 */
const OUTDATED_CODE = 'AwkBOh2oHB2ENPwAmg';

/** Stored editable Outdated build of `OUTDATED_CODE`. */
export const OUTDATED_BUILD = { id: 'outdated', code: OUTDATED_CODE, readonly: false };

/** Stored readonly Outdated build of `OUTDATED_CODE`. */
export const READONLY_OUTDATED_BUILD = { id: 'outdated', code: OUTDATED_CODE, readonly: true };

export const NAVIGATION = 'Builds';

export const OUTDATED_MARK = 'Outdated build';

export const OUTDATED_CHIP = '1 outdated selection';

export const UPDATE_LABEL = 'Update';

export const CANCEL_LABEL = 'Cancel';

export const UPDATE_DIALOG = 'Update build';

export const OLD_LABEL = 'OLD';

/** Rank of the outdated Sharpshooter. */
export const LANCE_CORPORAL = 'Lance Corporal';

/** Perk of Corporal that the code has on Lance Corporal. */
export const SHARPSHOOTER = 'Sharpshooter';

/** Perk the current tree has where the code has Sharpshooter. */
export const RAPID_FIRE = 'Rapid Fire';

/** Perk of Gunnery Sergeant that the code keeps. */
export const LONE_WOLF = 'Lone Wolf';

/** Perks of the code on the ranks without Outdated selections. */
export const KEPT_PERKS = [
  { rank: 'Sergeant', perk: 'Aggression' },
  { rank: 'Tech Sergeant', perk: 'Killer Instinct' },
  { rank: 'Gunnery Sergeant', perk: LONE_WOLF },
  { rank: 'Master Sergeant', perk: 'Sprinter' },
];

export const OUTDATED_NOTE = 'Outdated selection: in this mod version Lance Corporal has Rapid Fire here.';

export const EXPORT_LABEL = 'Export build';

export const LOCK_LABEL = 'Lock build';

/** Card of the update: the rank, the perk of the code and the empty cell. */
export const UPDATE_CARD_TEXT = /Class tree.*Lance Corporal.*Sharpshooter.*Empty/;
