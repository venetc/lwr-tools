import type { BuildListOptions } from '@features/manage-builds/model/build-list';
import type { LockableItem } from '@shared/lib/stored-list';

export interface BuildDataMock {
  /** Build name. */
  name: string
  /** Selected perks. */
  perks: string[]
}

export type BuildMock = LockableItem<BuildDataMock>;

export const EDITABLE_ID = 'editable';

export const LOCKED_ID = 'locked';

/**
 * Fresh builds of the list: one editable, one locked.
 */
export const createBuildsMock = (): BuildMock[] => [
  { id: EDITABLE_ID, name: 'Editable', perks: ['left'], readonly: false },
  { id: LOCKED_ID, name: 'Locked', perks: ['right'], readonly: true },
];

/**
 * Stored list options with fresh default builds; a build is stored as it is, but never read back, so each list starts
 * from the default builds.
 */
export const createOptionsMock = (): BuildListOptions<BuildDataMock> => ({
  orderKey: 'app.builds.v1.order',
  itemKeyPrefix: 'app.builds.v1.build.',
  serialize: build => build,
  parse: () => null,
  defaultItems: createBuildsMock,
  newData: () => ({ name: 'New', perks: [] }),
});

export const IMPORTED_DATA: BuildDataMock = { name: 'Imported', perks: ['top'] };

export const REPLACED_EDITABLE_BUILD = { id: EDITABLE_ID, name: 'Imported', perks: ['top'], readonly: false };

export const LOCKED_BUILD = { id: LOCKED_ID, name: 'Locked', perks: ['right'], readonly: true };

export const FOREIGN_IDENTITY_DATA = { ...IMPORTED_DATA, id: 'foreign', readonly: true };

export const NEW_NAME = 'Renamed';

export const EDITED_PERKS = ['left', 'top'];

export const EDITABLE_KEY = 'app.builds.v1.build.editable';

export const EDITED_RECORD = '{"id":"editable","name":"Editable","perks":["left","top"],"readonly":false}';

export const RESET_EDITABLE_BUILD = { id: EDITABLE_ID, name: 'Editable', perks: [], readonly: false };
