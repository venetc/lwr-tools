/**
 * Section ids of soldier build codes. A new section gets the next id; ids are never changed or reused.
 * A section whose fields change gets a new id with a version suffix (`TALENTS_V2`), and the old id keeps its reader.
 */
export const SOLDIER_BUILD_SECTION = {
  TALENTS: 1,
  NAME: 2,
} as const;
