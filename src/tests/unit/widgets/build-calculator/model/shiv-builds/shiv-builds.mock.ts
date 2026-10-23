import { expect } from 'vitest';

import type { PageMock } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';

/**
 * Entity of SHIVs with three technology levels without perks and a selection that only puts the id at the index.
 */
export const SHIV_ENTITY_MOCK = {
  TECHNOLOGY_LEVELS: [{ perks: [] }, { perks: [] }, { perks: [] }],
  SHIV_BUILD_NAME: 'SHIV',
  selectShivBuildPerk: (build: { perks: (string | null)[] }, index: number, id: string | null) => {
    build.perks[index] = id;
  },
};

/**
 * Share codes that store every build as it is and read nothing back, so each store starts from its default builds.
 */
export const SHARE_BUILD_MOCK = {
  storedBuildCodec: () => ({ serialize: (build: object) => build, parse: () => null }),
};

export const DEFAULT_SHIV_ID = 'default-shiv';

export const DEFAULT_SHIV_BUILD = { id: 'default-shiv', perks: [null, null, null], name: 'SHIV', readonly: false };

export const PICKED_PERKS = [null, 'picked', null];

export const LOCKED_SHIV_BUILD = { ...DEFAULT_SHIV_BUILD, readonly: true };

export const LOCKED_PICKED_BUILD = { ...LOCKED_SHIV_BUILD, perks: [null, 'picked', null] };

export const NEW_SHIV_BUILD = { ...DEFAULT_SHIV_BUILD, id: expect.any(String) };

export const RENAMED_SHIV_BUILD = { ...DEFAULT_SHIV_BUILD, name: 'Renamed' };

export const NEW_NAME = 'Renamed';

/** Delay after the last change before builds are saved, in milliseconds. */
export const SAVE_DELAY = 300;

/** Key prefix of a stored SHIV build, followed by the build id. */
const BUILD_KEY_PREFIX = 'lwr-tools.shiv-builds.v1.build.';

/**
 * Stored record of the build: with the share codes of the mock, the build itself; null if it is not stored.
 *
 * @param page page environment.
 * @param id build id.
 */
export const storedBuild = (page: PageMock, id: string): unknown => {
  const value = page.values.get(`${BUILD_KEY_PREFIX}${id}`);

  return value ? JSON.parse(value) : null;
};
