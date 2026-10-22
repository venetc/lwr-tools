import { createLoadoutMock } from '../loadout/loadout.mock';

export const FULL_LOADOUT = createLoadoutMock({ secondary: 'pistol', utility: ['he-grenade', 'medikit'] });

export const MEC_LOADOUT = createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', modules: ['flamethrower'] });
