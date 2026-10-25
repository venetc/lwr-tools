import type { SoldierStepKind } from '@entities/soldier';

import type { StepListBits } from '../model/section-fields';
import type { ShareCodeReadResult } from '../model/share-code';

/**
 * Formats of all share codes of the app; a new format gets the next number; numbers are never changed or reused.
 */
export const SHARE_CODE_FORMAT = {
  BIOSOLDIER_BUILD: 1,
  SHIV_BUILD: 2,
  MEC_BUILD: 3,
  SQUAD: 4,
} as const;

/**
 * Section ids of soldier build codes, shared by every soldier format, and of the Unit codes over them (`LOADOUT`).
 * A new section gets the next id; ids are never changed or reused.
 * A section whose fields change gets a new id with a version suffix (`PERKS_V2`), and the old id keeps its reader.
 */
export const SOLDIER_BUILD_SECTION = {
  PERKS: 1,
  NAME: 2,
  GENE_MODS: 3,
  PSIONIC: 4,
  OFFICER: 5,
  LOADOUT: 6,
  SIGNATURE_SKILL: 7,
} as const;

/** Width of the class number; part of the `PERKS` section, a change means a new section id. */
export const CLASS_CODE_BITS = 5;

/**
 * Width of the ability number of a selection; part of the `PERKS`, `GENE_MODS`, `PSIONIC`, `OFFICER` and
 * `SIGNATURE_SKILL` sections, a change means new section ids.
 */
export const ABILITY_CODE_BITS = 8;

/** Fields of the ranks in the `PERKS` section, from the second rank; a change means a new section id. */
export const RANK_STEP_BITS = {
  count: 3,
  variant: 2,
  code: ABILITY_CODE_BITS,
} as const satisfies StepListBits;

/** Fields of the body parts in the `GENE_MODS` section; a change means a new section id. */
export const BODY_PART_STEP_BITS = {
  count: 3,
  variant: 1,
  code: ABILITY_CODE_BITS,
} as const satisfies StepListBits;

/** Fields of the psi levels in the `PSIONIC` section; a change means a new section id. */
export const PSI_LEVEL_STEP_BITS = {
  count: 3,
  variant: 2,
  code: ABILITY_CODE_BITS,
} as const satisfies StepListBits;

/** Fields of the officer ranks in the `OFFICER` section; a change means a new section id. */
export const OFFICER_RANK_STEP_BITS = {
  count: 3,
  variant: 1,
  code: ABILITY_CODE_BITS,
} as const satisfies StepListBits;

/** Width of the name byte length; part of the `NAME` section, a change means a new section id. */
export const NAME_LENGTH_BITS = 5;

/**
 * Section ids of SHIV build codes and of the Unit codes over them (`LOADOUT`). A new section gets the next id; ids are
 * never changed or reused.
 * A section whose fields change gets a new id with a version suffix (`PERKS_V2`), and the old id keeps its reader.
 */
export const SHIV_BUILD_SECTION = {
  PERKS: 1,
  NAME: 2,
  LOADOUT: 3,
} as const;

/** Width of the selected SHIV perk count; part of the SHIV `PERKS` section, a change means a new section id. */
export const SHIV_PERK_COUNT_BITS = 3;

/** Width of the SHIV perk number; part of the SHIV `PERKS` section, a change means a new section id. */
export const SHIV_PERK_CODE_BITS = 6;

/** Width of an item code; part of the `LOADOUT` section, a change means a new section id. Code 0 is an empty slot. */
export const LOADOUT_ITEM_CODE_BITS = 8;

/** Width of the utility slot count; part of the `LOADOUT` section, a change means a new section id. */
export const UTILITY_COUNT_BITS = 3;

/** Width of the Module slot count; part of the `LOADOUT` section, a change means a new section id. */
export const MODULE_COUNT_BITS = 2;

/** Item code of an empty slot in the `LOADOUT` section. */
export const EMPTY_ITEM_CODE = 0;

/**
 * Section ids of the Squad header, the first part of a Squad code. A new section gets the next id; ids are never
 * changed or reused.
 */
export const SQUAD_SECTION = {
  NAME: 1,
} as const;

/** Separator of the parts of a Squad code: the Squad header, then a Unit code per Unit; base64url has no dot. */
export const SQUAD_CODE_SEPARATOR = '.';

/** Error under the Import field of a Build calculator for a code that reads as no Unit and no Squad. */
export const INVALID_CODE_TEXT = 'Invalid code';

/** Section name of a SHIV tree step on an Outdated selection card. */
export const SHIV_TREE_SECTION = 'SHIV tree';

/** Section name of a soldier step on an Outdated selection card, by the kind of the step. */
export const SOLDIER_STEP_SECTION = {
  'rank': 'Class tree',
  'body-part': 'Gene mods',
  'psi-level': 'Psionic',
  'officer-rank': 'Officer',
} as const satisfies Record<SoldierStepKind, string>;

/** Note of the empty cell of an Outdated selection card for a perk gone from the SHIV tree. */
export const REMOVED_FROM_SHIV_TREE_NOTE = 'Removed from the SHIV tree';

/** Note of the empty cell of an Outdated selection card in the update of an Outdated build: the step stays empty. */
export const EMPTY_STEP_NOTE = 'Empty';

/** Title, intro and confirm label of the Outdated selections dialog by what it confirms: an import or a build update. */
export const OUTDATED_SELECTIONS_DIALOG_TEXT = {
  import: {
    title: 'Outdated selections',
    intro: 'This code was made for an older mod version. These selections no longer fit the trees: Import clears them, and their steps stay empty.',
    confirmLabel: 'Import',
  },
  update: {
    title: 'Update build',
    intro: 'Update clears these selections for good, and their steps stay empty. The original build cannot be restored afterwards.',
    confirmLabel: 'Update',
  },
} as const;

/** Result of a share code that reads as no Unit and no Squad. */
export const INVALID_SHARE_CODE = { status: 'invalid' } as const satisfies ShareCodeReadResult;
