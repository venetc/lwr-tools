import { z } from 'zod';

import type { DeepReadonly } from '@shared/lib/object';

import type { ShareCodeFailure } from '../model/share-code';
import type { ShivBuildPart } from '../model/shiv-build-code';
import type { SoldierBuildPart } from '../model/soldier-build-code';

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

/**
 * Section ids of soldier build codes, shared by every soldier format. A new section gets the next id; ids are never changed or reused.
 * A section whose fields change gets a new id with a version suffix (`PERKS_V2`), and the old id keeps its reader.
 */
export const SOLDIER_BUILD_SECTION = {
  PERKS: 1,
  NAME: 2,
} as const;

/** Width of the class number; part of the `PERKS` section, a change means a new section id. */
export const CLASS_CODE_BITS = 5;

/** Width of the selected perk count; part of the `PERKS` section, a change means a new section id. */
export const PERK_COUNT_BITS = 3;

/** Width of the ability number; part of the `PERKS` section, a change means a new section id. */
export const ABILITY_CODE_BITS = 8;

/** Width of the name byte length; part of the `NAME` section, a change means a new section id. */
export const NAME_LENGTH_BITS = 5;

/**
 * Section ids of SHIV build codes. A new section gets the next id; ids are never changed or reused.
 * A section whose fields change gets a new id with a version suffix (`PERKS_V2`), and the old id keeps its reader.
 */
export const SHIV_BUILD_SECTION = {
  PERKS: 1,
  NAME: 2,
} as const;

/** Width of the selected SHIV perk count; part of the SHIV `PERKS` section, a change means a new section id. */
export const SHIV_PERK_COUNT_BITS = 3;

/** Width of the SHIV perk number; part of the SHIV `PERKS` section, a change means a new section id. */
export const SHIV_PERK_CODE_BITS = 6;

/** Optional parts of a soldier build read from a code by default. */
export const SOLDIER_BUILD_PARTS: DeepReadonly<SoldierBuildPart[]> = ['name'];

/** Optional parts of a SHIV build read from a code by default. */
export const SHIV_BUILD_PARTS: DeepReadonly<ShivBuildPart[]> = ['name'];

/** Result of a broken share code. */
export const INVALID_SHARE_CODE: DeepReadonly<ShareCodeFailure> = { status: 'invalid' };

/** Stored build record: share code of the build and its lock. */
export const STORED_BUILD_SCHEMA = z.object({
  code: z.string(),
  readonly: z.boolean(),
});
