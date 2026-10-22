import type { ListedBuild } from '@features/manage-builds/model/build-list';
import type { StoredListOptions } from '@shared/lib/stored-list';

export interface BuildDataMock {
  /** Build name. */
  name: string
  /** Selected perks. */
  perks: string[]
}

export type BuildMock = ListedBuild<BuildDataMock>;

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
 * Stored list options with fresh default builds; the builds are never stored, so each list starts from them.
 */
export const createOptionsMock = (): StoredListOptions<BuildMock> => ({
  orderKey: 'app.builds.v1.order',
  itemKeyPrefix: 'app.builds.v1.build.',
  serialize: () => null,
  parse: () => null,
  defaultItems: createBuildsMock,
});

export const IMPORTED_DATA: BuildDataMock = { name: 'Imported', perks: ['top'] };

export const REPLACED_EDITABLE_BUILD = { id: EDITABLE_ID, name: 'Imported', perks: ['top'], readonly: false };

export const LOCKED_BUILD = { id: LOCKED_ID, name: 'Locked', perks: ['right'], readonly: true };

export const FOREIGN_IDENTITY_DATA = { ...IMPORTED_DATA, id: 'foreign', readonly: true };

export const NEW_NAME = 'Renamed';
