import { z } from 'zod';

import type { BuildCodeKind } from '../model/build-codecs';
import type { ShareCodeFailure } from '../model/share-code';

/**
 * Formats of all share codes of the app; a new format gets the next number; numbers are never changed or reused.
 */
export const SHARE_CODE_FORMAT = {
  BIOSOLDIER_BUILD: 1,
  SHIV_BUILD: 2,
  MEC_BUILD: 3,
} as const;

/** Unit whose builds each format carries, by format number; a code of a listed format is reported as another unit's. */
export const SHARE_CODE_FORMAT_UNIT: ReadonlyMap<number, string> = new Map([
  [SHARE_CODE_FORMAT.BIOSOLDIER_BUILD, 'Biosoldier'],
  [SHARE_CODE_FORMAT.SHIV_BUILD, 'SHIV'],
  [SHARE_CODE_FORMAT.MEC_BUILD, 'MEC'],
]);

/** Kind of build each build code format carries, by format number; a Unit code shares the format of its build. */
export const BUILD_CODE_KIND_BY_FORMAT: ReadonlyMap<number, BuildCodeKind> = new Map([
  [SHARE_CODE_FORMAT.BIOSOLDIER_BUILD, 'biosoldier'],
  [SHARE_CODE_FORMAT.SHIV_BUILD, 'shiv'],
  [SHARE_CODE_FORMAT.MEC_BUILD, 'mec'],
]);

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

/** Result of a broken share code: a build code or a Unit code. */
export const INVALID_SHARE_CODE = { status: 'invalid' } as const satisfies ShareCodeFailure;

/** Stored build record: share code of the build and its lock. */
export const STORED_BUILD_SCHEMA = z.object({
  code: z.string(),
  readonly: z.boolean(),
});
