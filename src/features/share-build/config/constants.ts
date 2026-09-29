import type { SoldierBuildPart } from '../model/soldier-build-code';

/**
 * Formats of all share codes of the app; a new format gets the next number; numbers are never changed or reused.
 */
export const SHARE_CODE_FORMAT = {
  SOLDIER_BUILD: 1,
} as const;

/**
 * Section ids of soldier build codes. A new section gets the next id; ids are never changed or reused.
 * A section whose fields change gets a new id with a version suffix (`TALENTS_V2`), and the old id keeps its reader.
 */
export const SOLDIER_BUILD_SECTION = {
  TALENTS: 1,
  NAME: 2,
} as const;

/** Width of the class number; part of the `TALENTS` section, a change means a new section id. */
export const CLASS_CODE_BITS = 5;

/** Width of the selected talent count; part of the `TALENTS` section, a change means a new section id. */
export const TALENT_COUNT_BITS = 3;

/** Width of the ability number; part of the `TALENTS` section, a change means a new section id. */
export const ABILITY_CODE_BITS = 8;

/** Width of the name byte length; part of the `NAME` section, a change means a new section id. */
export const NAME_LENGTH_BITS = 5;

/** Optional parts of a soldier build read from a code by default. */
export const SOLDIER_BUILD_PARTS: SoldierBuildPart[] = ['name'];
