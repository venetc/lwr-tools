export const PAGE_PATH = '/builds/biosoldier';

export const PANEL_NAME = 'Sniper';

export const STORAGE_PREFIX = 'lwr-tools.biosoldier-builds.v1.';

/** Perk of Master Sergeant, not selected in a Default build. */
export const LONE_WOLF = 'Lone Wolf';

/** Base perk of the Sniper, always selected. */
export const SQUADSIGHT = 'Squadsight';

export const SELECT_LABEL = 'Select signature skill';

export const LONE_WOLF_LABEL = 'Signature skill: Lone Wolf';

export const IN_BUILD_LABEL = 'In the Build';

export const CLEAR_LABEL = 'Clear';

export const CLOSE_LABEL = 'Close';

export const LOCK_LABEL = 'Lock build';

export const RENAME_LABEL = 'Rename build';

/** Name long enough to fill the header of a panel on a phone. */
export const LONG_NAME = 'Overwatch sniper of the night';

/** Sniper build code from an older mod version: Sharpshooter on Lance Corporal, Lone Wolf as the Signature skill. */
const OUTDATED_CODE = 'AQhgOh2A4IIQAB8';

/** Stored editable Outdated build of `OUTDATED_CODE`. */
export const OUTDATED_BUILD = { id: 'outdated', code: OUTDATED_CODE, readonly: false };

/** Half the height of the Signature skill button, in pixels: the most its center may sit off the center of the name. */
export const ROW_TOLERANCE = 14;
