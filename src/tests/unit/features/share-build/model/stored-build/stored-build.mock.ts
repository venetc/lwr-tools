import { defaultShivBuild } from '@entities/shiv/model/build';
import { MEC_CLASSES } from '@entities/soldier';
import { defaultSoldierBuild } from '@entities/soldier/model/build';

const [FIRST_MEC_CLASS] = MEC_CLASSES;

export const BUILD_ID = 'build-1';

export const INVALID_CODE = 'invalid-code';

export const SHIV_BUILD = { ...defaultShivBuild(), name: 'Tank', id: BUILD_ID, readonly: true };

export const UNENCODABLE_SHIV_BUILD = { ...SHIV_BUILD, perks: ['unknown-perk', null, null] };

export const MEC_BUILD = defaultSoldierBuild(FIRST_MEC_CLASS);
