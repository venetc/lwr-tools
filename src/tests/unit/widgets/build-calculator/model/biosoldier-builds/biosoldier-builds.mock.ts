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
 * Entity of biosoldiers with two classes, Default builds of two ranks and one step in every other branch, and selections
 * that only put the id at the index.
 */
export const SOLDIER_ENTITY_MOCK = {
  BIOSOLDIER_CLASSES: [ASSAULT, SNIPER],
  BODY_PARTS: [],
  PSI_LEVELS: [],
  OFFICER_RANKS: [],
  defaultBiosoldierBuild: (soldierClass: SoldierClass) => ({
    soldierClass,
    perks: [soldierClass.basePerk, null],
    geneMods: [null, null],
    psionicAbilities: [null],
    officerPerks: [null],
    name: soldierClass.name,
    signatureSkill: null,
  }),
  selectSoldierBuildPerk: (build: { perks: (string | null)[] }, index: number, id: string | null) => {
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
  selectSoldierBuildSignatureSkill: (build: { signatureSkill: string | null }, id: string | null) => {
    build.signatureSkill = id;
  },
};

/**
 * Stored build records that keep every build as it is and read it back as it is, so a store without stored builds
 * starts from its default builds.
 */
export const STORED_BUILD_MOCK = {
  storedBuildCodec: () => ({ serialize: (build: object) => build, parse: (_: string, record: unknown) => record }),
};

export const DEFAULT_ASSAULT_ID = 'default-assault';

export const DEFAULT_ASSAULT_BUILD = {
  id: 'default-assault',
  soldierClass: ASSAULT,
  perks: ['run-and-gun', null],
  geneMods: [null, null],
  psionicAbilities: [null],
  officerPerks: [null],
  name: 'Assault',
  signatureSkill: null,
  readonly: false,
  outdated: null,
};

export const DEFAULT_BUILDS = [
  DEFAULT_ASSAULT_BUILD,
  { ...DEFAULT_ASSAULT_BUILD, id: 'default-sniper', soldierClass: SNIPER, perks: ['squadsight', null], name: 'Sniper' },
];

export const LOCKED_ASSAULT_BUILD = { ...DEFAULT_ASSAULT_BUILD, readonly: true };

export const LOCKED_PICKED_BUILD = { ...LOCKED_ASSAULT_BUILD, perks: ['picked', null] };

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
  { action: 'selectBuildPerk', field: 'perks', selected: ['picked', null] },
  { action: 'selectBuildGeneMod', field: 'geneMods', selected: ['picked', null] },
  { action: 'selectBuildPsionicAbility', field: 'psionicAbilities', selected: ['picked'] },
  { action: 'selectBuildOfficerPerk', field: 'officerPerks', selected: ['picked'] },
] as const;

export const SIGNATURE_ASSAULT_BUILD = { ...DEFAULT_ASSAULT_BUILD, signatureSkill: 'picked' };

export const OUTDATED_ID = 'outdated';

/** Outdated build with a Signature skill, as the store reads it back. */
export const OUTDATED_BUILD = {
  ...DEFAULT_ASSAULT_BUILD,
  id: OUTDATED_ID,
  signatureSkill: 'kept',
  outdated: { code: 'stored-code', selections: [] },
};

/** Storage with only `OUTDATED_BUILD`. */
export const OUTDATED_STORAGE = {
  'lwr-tools.biosoldier-builds.v1.order': JSON.stringify([OUTDATED_ID]),
  [`${BUILD_KEY_PREFIX}${OUTDATED_ID}`]: JSON.stringify(OUTDATED_BUILD),
};
