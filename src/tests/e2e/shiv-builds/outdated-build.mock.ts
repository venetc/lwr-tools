export const PAGE_PATH = '/builds/shiv';

export const PANEL_NAME = 'SHIV';

export const STORAGE_PREFIX = 'lwr-tools.shiv-builds.v1.';

/** SHIV build code with Lock N' Load, Holo Rounds and Repair Servos: Lock N' Load and Repair Servos share Basic Config. */
const COLLISION_CODE = 'AghVgiBATQ';

/** Stored editable Outdated build of `COLLISION_CODE`. */
export const OUTDATED_BUILD = { id: 'outdated', code: COLLISION_CODE, readonly: false };

/** Stored readonly Outdated build of `COLLISION_CODE`. */
export const READONLY_OUTDATED_BUILD = { id: 'outdated', code: COLLISION_CODE, readonly: true };

export const NAVIGATION = 'Builds';

export const OUTDATED_MARK = 'Outdated build';

export const OUTDATED_CHIP = '2 outdated selections';

export const UPDATE_LABEL = 'Update';

export const CANCEL_LABEL = 'Cancel';

export const UPDATE_DIALOG = 'Update build';

export const OLD_LABEL = 'OLD';

/** Technology level of the collision. */
export const BASIC_CONFIG = 'Basic Config';

/** Perks of the code that collide on Basic Config. */
export const LOCK_N_LOAD = 'Lock N\' Load';

export const REPAIR_SERVOS = 'Repair Servos';

/** Perk of Basic Config outside the collision. */
export const PLATFORM_STABILITY = 'Platform Stability';

/** Perk of Advancements I that the code keeps. */
export const HOLO_ROUNDS = 'Holo Rounds';

export const COLLISION_NOTE = 'Outdated selection: in this mod version Lock N\' Load and Repair Servos are both on Basic Config.';

export const REMOVED_NOTE = 'removed from the SHIV tree';

export const EXPORT_LABEL = 'Export build';

export const LOCK_LABEL = 'Lock build';

export const RESET_LABEL = 'Reset build';

/** Card of the update: the step, both perks of the collision and the empty cell. */
export const UPDATE_CARD_TEXT = /SHIV tree.*Basic Config.*Lock N' Load.*Repair Servos.*Empty/;
