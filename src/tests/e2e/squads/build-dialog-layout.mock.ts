export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const SNIPER = 'Sniper';

export const RENAME_LABEL = 'Rename build';

export const LOCK_LABEL = 'Lock build';

export const CLOSE_LABEL = 'Close';

export const SHARE_LABEL = 'Share build';

/** Smallest side of a header button, in pixels, comfortable for a finger. */
export const TOUCH_SIZE = 34;

/** Farthest the build name may start below the top of the dialog, in pixels: a dialog header of its own would push it lower. */
export const NAME_MAX_TOP = 40;

/** Widest the dialog may be beyond the Build panel, in pixels: the side paddings of the dialog and nothing more. */
export const HUG_MAX_EXTRA_WIDTH = 40;

/** Phone viewport too low for the whole Build panel, so the dialog scrolls. */
export const LOW_PHONE_VIEWPORT = { width: 393, height: 480 };

/** Widest phone viewport, where the dialog takes the whole screen and is wider than the Build panel. */
export const WIDE_PHONE_VIEWPORT = { width: 599, height: 852 };
