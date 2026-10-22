import type { LoadoutCodes } from '@entities/loadout/model/loadout-codes';

import { createLoadoutMock } from '../loadout/loadout.mock';

export const UNKNOWN_CODE = 999;

export const BIOSOLDIER_LOADOUT = createLoadoutMock({ armor: 'aegis-armor', secondary: 'pistol', utility: ['he-grenade', null, 'alloy-plating'] });

export const BIOSOLDIER_CODES: LoadoutCodes = { armor: 6, primary: 1, secondary: 13, utility: [1, null, 14], modules: [] };

export const MEC_LOADOUT = createLoadoutMock({ armor: 'lmec3-vindicator', primary: 'minigun', utility: ['the-thumper', null], modules: ['kinetic-strike-module', null, 'flamethrower'] });

export const MEC_CODES: LoadoutCodes = { armor: 21, primary: 10, secondary: null, utility: [37, null], modules: [57, null, 56] };

export const SHIV_LOADOUT = createLoadoutMock({ armor: 'alloy-shiv', primary: 'autocannon', utility: ['motion-tracker', null] });

export const SHIV_CODES: LoadoutCodes = { armor: 2, primary: 11, secondary: null, utility: [40, null], modules: [] };

export const UNKNOWN_CODES: LoadoutCodes = { armor: UNKNOWN_CODE, primary: UNKNOWN_CODE, secondary: UNKNOWN_CODE, utility: [UNKNOWN_CODE, 1], modules: [UNKNOWN_CODE] };

export const UNKNOWN_CODES_LOADOUT = { armor: null, primary: null, secondary: null, utility: [null, 'he-grenade'], modules: [null] };
