import type { LoadoutUnit } from '@entities/loadout';
import type { SoldierClass } from '@entities/soldier';

/**
 * Class with only the fields the New build tab reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: string, name: string) => ({ id, name, icon: {} } as SoldierClass);

export const ASSAULT = soldierClassMock('assault', 'Assault');

export const SNIPER = soldierClassMock('sniper', 'Sniper');

export const GOLIATH = soldierClassMock('goliath', 'Goliath');

/**
 * Entity of soldiers with two biosoldier classes and one MEC class.
 */
export const SOLDIER_ENTITY_MOCK = {
  BIOSOLDIER_CLASSES: [ASSAULT, SNIPER],
  MEC_CLASSES: [GOLIATH],
  biosoldierBuildTraits: () => ({ hasGeneMod: false, hasPsionicAbility: false, isOfficer: false }),
};

export const BIOSOLDIER_UNIT: LoadoutUnit = { id: 'biosoldier', code: 1, name: 'Biosoldier' };

export const MEC_UNIT: LoadoutUnit = { id: 'mec', code: 2, name: 'MEC' };

export const SHIV_UNIT: LoadoutUnit = { id: 'shiv', code: 3, name: 'SHIV' };

export const BIOSOLDIER_GROUP = {
  id: 'biosoldier',
  title: 'Biosoldier',
  options: [
    { id: 'assault', kind: 'biosoldier', name: 'Assault', icon: ASSAULT.icon, soldierClass: ASSAULT },
    { id: 'sniper', kind: 'biosoldier', name: 'Sniper', icon: SNIPER.icon, soldierClass: SNIPER },
  ],
};

export const MEC_GROUP = {
  id: 'mec',
  title: 'MEC',
  options: [{ id: 'goliath', kind: 'mec', name: 'Goliath', icon: GOLIATH.icon, soldierClass: GOLIATH }],
};

export const SHIV_GROUP = {
  id: 'shiv',
  title: 'SHIV',
  options: [{ id: 'shiv', kind: 'shiv', name: 'SHIV', icon: null, soldierClass: null }],
};
