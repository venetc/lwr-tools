import { z } from 'zod';

/**
 * Prefix of all stored keys of Squads. Keys are never changed: a new shape of stored records gets a new version (`v2`),
 * and loading reads the old one.
 */
export const SQUAD_STORAGE_PREFIX = 'lwr-tools.squads.v1.';

/** Key of the stored order of Squads: a JSON array of Squad ids; its absence means nothing has been saved yet. */
export const SQUAD_ORDER_KEY = `${SQUAD_STORAGE_PREFIX}order`;

/** Key prefix of a stored Squad, followed by the Squad id; the value is the JSON record of the Squad with all its Units. */
export const SQUAD_KEY_PREFIX = `${SQUAD_STORAGE_PREFIX}squad.`;

/** Key of the id of the open Squad; written on switching, read on entry, and not synced between tabs. */
export const OPEN_SQUAD_KEY = `${SQUAD_STORAGE_PREFIX}open`;

/**
 * Id of the Squad shown while nothing has been saved yet. A fixed id lets tabs opened for the first time at once save
 * the same record instead of doubling the list.
 */
export const DEFAULT_SQUAD_ID = 'default-squad';

/** Name of a new Squad, followed by its number: `Squad 1`; also restored when the name is left blank. */
export const SQUAD_NAME = 'Squad';

/** Stored item code of a Loadout slot: the `code` of the item in its catalog; null for an empty slot. */
const STORED_ITEM_CODE_SCHEMA = z.number().int().nullable();

/**
 * Stored Unit: its id, the build it refers to and the Loadout as item codes.
 */
export const STORED_UNIT_SCHEMA = z.object({
  id: z.string(),
  build: z.object({
    kind: z.string(),
    id: z.string(),
  }),
  loadout: z.object({
    armor: STORED_ITEM_CODE_SCHEMA,
    primary: STORED_ITEM_CODE_SCHEMA,
    secondary: STORED_ITEM_CODE_SCHEMA,
    utility: z.array(STORED_ITEM_CODE_SCHEMA),
    modules: z.array(STORED_ITEM_CODE_SCHEMA),
  }),
});

/** Stored Squad: its name and Units; each Unit is checked on its own, so an invalid one does not lose the Squad. */
export const STORED_SQUAD_SCHEMA = z.object({
  name: z.string(),
  units: z.array(z.unknown()),
});

/** Word after the number of Units when it is one: `Bravo (1 Unit)`. */
export const UNIT_WORD = 'Unit';

/** Word after the number of Units when it is not one: `Alpha (2 Units)`. */
export const UNITS_WORD = 'Units';

/** Word before the build name in the title of the build removal dialog: `Delete «Assault Ace»?` */
export const DELETE_WORD = 'Delete';

/** Words before the Squads a build stands in, in the build removal dialog: `It is in Squads: Alpha (2 Units), Bravo (1 Unit).` */
export const BUILD_SQUADS_LEAD = 'It is in Squads:';

/** What the removal of a build with one Unit takes, in the build removal dialog. */
export const ONE_UNIT_REMOVAL_TEXT = 'This Unit and its Loadout will be removed.';

/** What the removal of a build with several Units takes, after `These 3 Units`, in the build removal dialog. */
export const UNITS_REMOVAL_TEXT = 'and their Loadouts will be removed.';

/** Word before the number of Units the removal of a build takes: `These 3 Units`. */
export const UNITS_REMOVAL_LEAD = 'These';
