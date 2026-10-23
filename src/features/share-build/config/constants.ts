import { z } from 'zod';

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
} as const;

/** Width of the class number; part of the `PERKS` section, a change means a new section id. */
export const CLASS_CODE_BITS = 5;

/** Width of the selected perk count; part of the `PERKS` section, a change means a new section id. */
export const PERK_COUNT_BITS = 3;

/** Width of the ability number; part of the `PERKS` section, a change means a new section id. */
export const ABILITY_CODE_BITS = 8;

/** Width of the gene mod count; part of the `GENE_MODS` section, a change means a new section id. */
export const GENE_MOD_COUNT_BITS = 3;

/** Width of the psionic ability count; part of the `PSIONIC` section, a change means a new section id. */
export const PSIONIC_ABILITY_COUNT_BITS = 3;

/** Width of the officer perk count; part of the `OFFICER` section, a change means a new section id. */
export const OFFICER_PERK_COUNT_BITS = 3;

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

/** Result of a share code that reads as no Unit and no Squad. */
export const INVALID_SHARE_CODE = { status: 'invalid' } as const satisfies ShareCodeReadResult;

/** Stored build record: share code of the build and its lock. */
export const STORED_BUILD_SCHEMA = z.object({
  code: z.string(),
  readonly: z.boolean(),
});
