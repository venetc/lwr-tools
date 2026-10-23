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

export const ASSAULT = soldierClassMock('assault', 'Assault', 'run-and-gun');

export const SNIPER = soldierClassMock('sniper', 'Sniper', 'squadsight');

/**
 * Entity of biosoldiers with two classes and selections that only put the id at the index.
 */
export const SOLDIER_ENTITY_MOCK = {
  BIOSOLDIER_CLASSES: [ASSAULT, SNIPER],
  EMPTY_GENE_MODS: [null, null],
  BODY_PARTS: [],
  PSI_LEVELS: [],
  OFFICER_RANKS: [],
  selectBiosoldierBuildPerk: (build: { perks: (string | null)[] }, index: number, id: string | null) => {
    build.perks[index] = id;
  },
  selectBiosoldierBuildGeneMod: (build: { geneMods: (string | null)[] }, index: number, id: string | null) => {
    build.geneMods[index] = id;
  },
  selectBiosoldierBuildPsionicAbility: (build: { psionicAbilities: (string | null)[] }, index: number, id: string | null) => {
    build.psionicAbilities[index] = id;
  },
  selectBiosoldierBuildOfficerPerk: (build: { officerPerks: (string | null)[] }, index: number, id: string | null) => {
    build.officerPerks[index] = id;
  },
};

/**
 * Share codes that store every build as it is and read nothing back, so each store starts from its default builds.
 */
export const SHARE_BUILD_MOCK = {
  storedBuildCodec: () => ({ serialize: (build: object) => build, parse: () => null }),
};

export const DEFAULT_ASSAULT_ID = 'default-assault';

export const DEFAULT_ASSAULT_BUILD = {
  id: 'default-assault',
  soldierClass: ASSAULT,
  perks: ['run-and-gun'],
  geneMods: [null, null],
  psionicAbilities: [],
  officerPerks: [],
  name: 'Assault',
  readonly: false,
};

export const DEFAULT_BUILDS = [
  DEFAULT_ASSAULT_BUILD,
  { ...DEFAULT_ASSAULT_BUILD, id: 'default-sniper', soldierClass: SNIPER, perks: ['squadsight'], name: 'Sniper' },
];

export const LOCKED_ASSAULT_BUILD = { ...DEFAULT_ASSAULT_BUILD, readonly: true };

export const LOCKED_PICKED_BUILD = { ...LOCKED_ASSAULT_BUILD, perks: ['picked'] };

export const NEW_SNIPER_BUILD = { ...DEFAULT_BUILDS[1], id: expect.any(String) };

export const RENAMED_ASSAULT_BUILD = { ...DEFAULT_ASSAULT_BUILD, name: 'Renamed' };

export const NEW_NAME = 'Renamed';

/** Delay after the last change before builds are saved, in milliseconds. */
export const SAVE_DELAY = 300;

/** Key prefix of a stored biosoldier build, followed by the build id. */
const BUILD_KEY_PREFIX = 'lwr-tools.biosoldier-builds.v1.build.';

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

/**
 * Selections of the store with the field of the build each one changes and the field after selecting `picked` on
 * the first tier.
 */
export const SELECTIONS = [
  { action: 'selectBuildPerk', field: 'perks', selected: ['picked'] },
  { action: 'selectBuildGeneMod', field: 'geneMods', selected: ['picked', null] },
  { action: 'selectBuildPsionicAbility', field: 'psionicAbilities', selected: ['picked'] },
  { action: 'selectBuildOfficerPerk', field: 'officerPerks', selected: ['picked'] },
] as const;
