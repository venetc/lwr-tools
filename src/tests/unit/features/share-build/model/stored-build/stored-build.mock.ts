import { defaultShivBuild } from '@entities/shiv/model/build';
import { MEC_CLASSES } from '@entities/soldier';
import { defaultSoldierBuild, selectSoldierBuildPerk } from '@entities/soldier/model/build';

const [FIRST_MEC_CLASS] = MEC_CLASSES;

export const BUILD_ID = 'build-1';

export const INVALID_CODE = 'invalid-code';

export const SHIV_BUILD = { ...defaultShivBuild(), name: 'Tank', id: BUILD_ID, readonly: true };

export const UNENCODABLE_SHIV_BUILD = { ...SHIV_BUILD, perks: ['unknown-perk', null, null] };

export const MEC_BUILD = defaultSoldierBuild(FIRST_MEC_CLASS);

/**
 * Stored MEC build with only the last rank selected.
 */
const createGappedMecBuild = () => {
  const build = { ...defaultSoldierBuild(FIRST_MEC_CLASS), id: BUILD_ID, readonly: false };

  selectSoldierBuildPerk(build, 6, FIRST_MEC_CLASS.perks['master-sergeant'][0] ?? null);

  return build;
};

export const GAPPED_MEC_BUILD = createGappedMecBuild();

/** SHIV build code with Lock N' Load and Repair Servos, two perks of Basic Config. */
export const COLLISION_CODE = 'Agg9AhAAnQ';
