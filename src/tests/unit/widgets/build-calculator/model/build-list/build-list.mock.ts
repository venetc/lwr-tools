import type { ShivBuildData } from '@entities/shiv';
import type { StoredOutdatedBuild } from '@features/share-build';
import type { BuildListOptions, SavedBuild } from '@widgets/build-calculator/model/build-list';

export type BuildMock = SavedBuild<'shiv'>;

export const EDITABLE_ID = 'editable';

export const LOCKED_ID = 'locked';

export const OUTDATED_ID = 'outdated';

export const LOCKED_OUTDATED_ID = 'locked-outdated';

/** Stored record of the Outdated builds. */
const OUTDATED_RECORD: StoredOutdatedBuild<'shiv'> = { code: 'stored-code', selections: [{ perkId: 'shredder', reason: 'removed' }] };

/**
 * Fresh builds of the list: one editable, one locked, then an editable and a locked Outdated build.
 */
export const createBuildsMock = (): BuildMock[] => [
  { id: EDITABLE_ID, name: 'Editable', perks: ['left'], readonly: false, outdated: null },
  { id: LOCKED_ID, name: 'Locked', perks: ['right'], readonly: true, outdated: null },
  { id: OUTDATED_ID, name: 'Outdated', perks: ['left'], readonly: false, outdated: { ...OUTDATED_RECORD } },
  { id: LOCKED_OUTDATED_ID, name: 'Locked outdated', perks: ['right'], readonly: true, outdated: { ...OUTDATED_RECORD } },
];

/**
 * Stored list options with fresh default builds; a build is stored as it is, but never read back, so each list starts
 * from the default builds.
 */
export const createOptionsMock = (): BuildListOptions<'shiv'> => ({
  orderKey: 'app.builds.v1.order',
  itemKeyPrefix: 'app.builds.v1.build.',
  serialize: build => build,
  parse: () => null,
  defaultItems: createBuildsMock,
  newData: () => ({ name: 'New', perks: [] }),
});

export const IMPORTED_DATA: ShivBuildData = { name: 'Imported', perks: ['top'] };

export const REPLACED_EDITABLE_BUILD = { id: EDITABLE_ID, name: 'Imported', perks: ['top'], readonly: false, outdated: null };

export const LOCKED_BUILD = { id: LOCKED_ID, name: 'Locked', perks: ['right'], readonly: true, outdated: null };

export const OUTDATED_BUILD = { id: OUTDATED_ID, name: 'Outdated', perks: ['left'], readonly: false, outdated: OUTDATED_RECORD };

export const UPDATED_BUILD = { id: OUTDATED_ID, name: 'Outdated', perks: ['left'], readonly: false, outdated: null };

export const UPDATED_LOCKED_BUILD = { id: LOCKED_OUTDATED_ID, name: 'Locked outdated', perks: ['right'], readonly: true, outdated: null };

export const OUTDATED_KEY = 'app.builds.v1.build.outdated';

export const UPDATED_RECORD = '{"id":"outdated","name":"Outdated","perks":["left"],"readonly":false,"outdated":null}';

export const FOREIGN_IDENTITY_DATA = { ...IMPORTED_DATA, id: 'foreign', readonly: true };

export const NEW_NAME = 'Renamed';

export const EDITED_PERKS = ['left', 'top'];

export const EDITABLE_KEY = 'app.builds.v1.build.editable';

export const EDITED_RECORD = '{"id":"editable","name":"Editable","perks":["left","top"],"readonly":false,"outdated":null}';

export const RESET_EDITABLE_BUILD = { id: EDITABLE_ID, name: 'Editable', perks: [], readonly: false, outdated: null };
