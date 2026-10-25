export const PAGE_PATH = '/builds/biosoldier';

export const PANEL_NAME = 'Sniper';

export const STORAGE_PREFIX = 'lwr-tools.biosoldier-builds.v1.';

/** Sniper build code from an older mod version with four Outdated selections. */
const OUTDATED_CODE = 'AQkAOh2wfC2pFIRhqy-bIIErW8ChGzoAAGU';

/** Stored editable Outdated build of `OUTDATED_CODE`. */
export const OUTDATED_BUILD = { id: 'outdated', code: OUTDATED_CODE, readonly: false };

export const LOCK_LABEL = 'Lock build';

export const OUTDATED_UPDATE_LABEL = '4 outdated selections. Update build';

/** Count of Outdated selections on the update button. */
export const OUTDATED_COUNT = '4';

export const REMOVE_LABEL = 'Remove build';

/** Smallest side of a header button, in pixels, comfortable for a finger. */
export const TOUCH_SIZE = 34;

/** Actions of the toolbar of an editable build, in order: accessible name and visible label. */
export const ACTIONS = [
  { name: 'Import build', label: 'Import' },
  { name: 'Share build', label: 'Share' },
  { name: 'Reset build', label: 'Reset' },
  { name: 'Remove build', label: 'Remove' },
];
