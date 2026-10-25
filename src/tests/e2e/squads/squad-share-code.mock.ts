export const BIOSOLDIER_PATH = '/builds/biosoldier';

/**
 * Squad code of `Alpha`: two Units of the Sniper build `Field Sniper` with Strength in Numbers and Seraph Armor, a Unit
 * of the Sniper build `Seraph Sniper` with Seraph Armor and no officer perks, and a Unit of a SHIV build code.
 */
export const SQUAD_CODE = 'BAi0qC2ODQwghg.AQiIOhHDsBGViM0srYyECm3NLgyuRQjZwAw9CgkNgWAAAAAALw.AQiIOhHDsBGViM0srYyECm3NLgyuRQjZwAw9CgkNgWAAAAAALw.AQg4OAEbWqbK5MLg0ECm3NLgyuRh6FBIbAsAAAAA-A.AggMAIE';

/** `SQUAD_CODE` with the last character of its last part changed. */
export const BROKEN_SQUAD_CODE = 'BAi0qC2ODQwghg.AQiIOhHDsBGViM0srYyECm3NLgyuRQjZwAw9CgkNgWAAAAAALw.AQiIOhHDsBGViM0srYyECm3NLgyuRQjZwAw9CgkNgWAAAAAALw.AQg4OAEbWqbK5MLg0ECm3NLgyuRh6FBIbAsAAAAA-A.AggMAIA';

/** Unit code of the Sniper build `Field Sniper`. */
export const UNIT_CODE = 'AQiIOhHDsBGViM0srYyECm3NLgyuRQjZwAw9CgkNgWAAAAAALw';

export const SQUAD_NAME = 'Alpha';

export const SQUAD_UNIT_COUNT = 4;

export const OFFICER_BUILD_NAME = 'Field Sniper';

export const SNIPER = 'Sniper';

export const BIOSOLDIER_BUILDS = 'Biosoldier builds';

export const COPIED_TOAST = 'Squad code copied';

export const IMPORTED_TOAST = 'Alpha opened with new Builds: 2 in Biosoldier builds, 1 in SHIV builds.';

export const SERAPH_REPLACED_LINE = 'Seraph Sniper — Seraph Armor replaced with Tactical Vest: needs officer.';

export const UNIT_CODE_HINT = 'This is a Unit code. Add it through an empty cell.';

export const SQUAD_CODE_UNIT_HINT = 'This is a Squad code. Use Import in the toolbar.';

export const SQUAD_CODE_CALCULATOR_HINT = 'Import it in the Squad planner.';

export const INVALID_CODE_ERROR = 'Invalid code. Copy the Share code again and paste it whole.';

/**
 * Squad code of `Alpha` from an older mod version: two Units of the Sniper build `Sniper` with Outdated selections on
 * a rank, a body part, a psi level and an officer rank, a Unit of a SHIV build whose Lock N' Load and Repair Servos
 * share Basic Config, and a Unit of `Field Sniper`, which fits the trees.
 */
export const OUTDATED_SQUAD_CODE = 'BAi0qC2ODQwghg.AQiIOh2FIRhqy-bIIErW8ChGzoBg6AAAAAAr.AghVgiBDDoAAAAAA_A.AQiIOh2FIRhqy-bIIErW8ChGzoBg6AAAAAAr.AQiIOhHDsBGViM0srYyECm3NLgyuRQjZwAw9CgkNgWAAAAAALw';

/** Headings of the card groups of `OUTDATED_SQUAD_CODE`: a Build with Outdated selections each, in Squad order. */
export const OUTDATED_GROUP_NAMES = ['Sniper', 'SHIV'];

/** Cards of `OUTDATED_SQUAD_CODE`: four of the shared Sniper build, then the SHIV collision. */
export const OUTDATED_CARD_TEXTS = [
  /Class tree.*Lance Corporal.*Sharpshooter.*Magnum/,
  /Gene mods.*Brain.*Advanced Perception.*Neural Damping/,
  /Psionic.*Awakened.*Psi Mastery.*Mind Fray/,
  /Officer.*Lieutenant.*Cover Tactics.*Strength in Numbers/,
  /Basic Config.*Lock N' Load.*Repair Servos.*Both on Basic Config now/,
];

export const OUTDATED_BUILD_NAME = 'Sniper';

/** Squad code of `Alpha` with a Unit of the outdated Sniper build `Sniper` and a Unit of `Field Sniper`. */
export const ONE_OUTDATED_BUILD_SQUAD_CODE = 'BAi0qC2ODQwghg.AQiIOh2FIRhqy-bIIErW8ChGzoBg6AAAAAAr.AQiIOhHDsBGViM0srYyECm3NLgyuRQjZwAw9CgkNgWAAAAAALw';

/** Steps of the mini-tree of the outdated Sniper build after the import: the outdated rank and a rank that fits. */
export const CLEARED_STEP = 'Lance Corporal: Empty';

export const KEPT_STEP = 'Master Sergeant: Lone Wolf';

export const SHIV = 'SHIV';

/** Steps of the mini-tree of the SHIV build after the import: the technology level of the collision and one that fits. */
export const SHIV_CLEARED_STEP = 'Basic Config: Empty';

export const SHIV_KEPT_STEP = 'Advancements I: Holo Rounds';

/**
 * Squad code of `Alpha` with a Unit of the outdated Sniper build `Sniper` in Seraph Armor: its only officer perk, Cover
 * Tactics on Lieutenant, is an Outdated selection.
 */
export const OUTDATED_SERAPH_SQUAD_CODE = 'BAi0qC2ODQwghg.AQiIOh2FIRhqy-bIIErW8ChGzoBh6FBIbAsAAAAAcQ';

export const OUTDATED_SERAPH_REPLACED_LINE = 'Sniper — Seraph Armor replaced with Tactical Vest: needs officer.';

export const TACTICAL_VEST_TILE = 'Armor: Tactical Vest';

export const CANCEL_LABEL = 'Cancel';

export const IMPORT_LABEL = 'Import';
