import type { DecodedLoadout } from '@entities/loadout';
import { defaultShivBuild } from '@entities/shiv/model/build';
import { BIOSOLDIER_CLASSES } from '@entities/soldier';
import { defaultBiosoldierBuild } from '@entities/soldier/model/build';

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

export const BIOSOLDIER_BUILD = defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

export const SHIV_BUILD = defaultShivBuild();

export const EMPTY_LOADOUT: DecodedLoadout = { armor: null, primary: null, secondary: null, utility: [], modules: [] };

export const SQUAD_NAME = 'Alpha';

export const SQUAD_CODE_RESULT = { status: 'squad-code' };

export const INVALID_RESULT = { status: 'invalid' };

export const OTHER_UNIT_RESULT = { status: 'other-unit', unit: 'SHIV' };
