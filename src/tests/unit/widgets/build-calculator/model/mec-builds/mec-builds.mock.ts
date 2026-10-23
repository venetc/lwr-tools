import { expect } from 'vitest';

import type { SoldierClass } from '@entities/soldier';

import type { PageMock } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';

/**
 * Class with only the fields the store reads.
 *
 * @param id class id.
 * @param name class name.
 * @param basePerk id of the base perk.
 */
const soldierClassMock = (id: string, name: string, basePerk: string) => ({ id, name, basePerk } as SoldierClass);

export const VALKYRIE = soldierClassMock('valkyrie', 'Valkyrie', 'jet-boots');

export const GOLIATH = soldierClassMock('goliath', 'Goliath', 'body-shield');

/**
 * Entity of MECs with two classes, Default builds of two ranks and a selection that only puts the id at the index.
 */
export const SOLDIER_ENTITY_MOCK = {
  MEC_CLASSES: [VALKYRIE, GOLIATH],
  BODY_PARTS: [],
  PSI_LEVELS: [],
  OFFICER_RANKS: [],
  defaultSoldierBuild: (soldierClass: SoldierClass) => ({ soldierClass, perks: [soldierClass.basePerk, null], name: soldierClass.name }),
  selectSoldierBuildPerk: (build: { perks: (string | null)[] }, index: number, id: string | null) => {
    build.perks[index] = id;
  },
};

/**
 * Share codes that store every build as it is and read nothing back, so each store starts from its default builds.
 */
export const SHARE_BUILD_MOCK = {
  storedBuildCodec: () => ({ serialize: (build: object) => build, parse: () => null }),
};

export const DEFAULT_VALKYRIE_ID = 'default-valkyrie';

export const DEFAULT_VALKYRIE_BUILD = {
  id: 'default-valkyrie',
  soldierClass: VALKYRIE,
  perks: ['jet-boots', null],
  name: 'Valkyrie',
  readonly: false,
};

export const DEFAULT_BUILDS = [
  DEFAULT_VALKYRIE_BUILD,
  { id: 'default-goliath', soldierClass: GOLIATH, perks: ['body-shield', null], name: 'Goliath', readonly: false },
];

export const PICKED_PERKS = ['picked', null];

export const LOCKED_VALKYRIE_BUILD = { ...DEFAULT_VALKYRIE_BUILD, readonly: true };

export const LOCKED_PICKED_BUILD = { ...LOCKED_VALKYRIE_BUILD, perks: PICKED_PERKS };

export const NEW_GOLIATH_BUILD = { ...DEFAULT_BUILDS[1], id: expect.any(String) };

export const RENAMED_VALKYRIE_BUILD = { ...DEFAULT_VALKYRIE_BUILD, name: 'Renamed' };

export const NEW_NAME = 'Renamed';

/** Delay after the last change before builds are saved, in milliseconds. */
export const SAVE_DELAY = 300;

/** Key prefix of a stored MEC build, followed by the build id. */
const BUILD_KEY_PREFIX = 'lwr-tools.mec-builds.v1.build.';

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
