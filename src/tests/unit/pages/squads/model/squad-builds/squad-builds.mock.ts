import { shallowReactive } from 'vue';

import type { SoldierClass } from '@entities/soldier';
import type { NewBuildOption } from '@pages/squads/model/new-build';
import type { BiosoldierBuild, MecBuild, ShivBuild } from '@widgets/build-calculator';

/**
 * Class with only the fields the Squad planner reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: string, name: string) => ({ id, name } as SoldierClass);

export const SNIPER = soldierClassMock('sniper', 'Sniper');

export const GOLIATH = soldierClassMock('goliath', 'Goliath');

/** Id that a biosoldier, a MEC and a SHIV build share: ids are unique only in their own Build calculator. */
export const SHARED_ID = 'shared';

export const SNIPER_BUILD: BiosoldierBuild = {
  id: 'shared',
  name: 'Overwatch Sniper',
  readonly: false,
  outdated: null,
  soldierClass: SNIPER,
  perks: [],
  geneMods: [],
  psionicAbilities: [],
  officerPerks: [],
};

export const GOLIATH_BUILD: MecBuild = { id: 'shared', name: 'Goliath Wall', readonly: false, outdated: null, soldierClass: GOLIATH, perks: [] };

export const SHIV_BUILD: ShivBuild = { id: 'shared', name: 'Alloy Support', readonly: false, outdated: null, perks: [] };

export const SQUAD_BUILDS = [
  { kind: 'biosoldier', build: SNIPER_BUILD },
  { kind: 'mec', build: GOLIATH_BUILD },
  { kind: 'shiv', build: SHIV_BUILD },
];

export const MEC_SQUAD_BUILD = { kind: 'mec', build: GOLIATH_BUILD };

/**
 * Store of a Build calculator with its builds; a new build gets the id `new` and the data the store is given.
 *
 * @param newBuild build data of the store's new build.
 */
const buildsStoreMock = <Build>(newBuild: (soldierClass: SoldierClass) => Build) => {
  const store = shallowReactive({
    builds: [] as Build[],
    addBuild: (soldierClass: SoldierClass) => {
      store.builds = [...store.builds, newBuild(soldierClass)];

      return 'new';
    },
  });

  return store;
};

const biosoldierStore = buildsStoreMock(soldierClass => ({ ...SNIPER_BUILD, id: 'new', name: 'New', soldierClass }));

const mecStore = buildsStoreMock(soldierClass => ({ ...GOLIATH_BUILD, id: 'new', name: 'New', soldierClass }));

const shivStore = buildsStoreMock(() => ({ ...SHIV_BUILD, id: 'new', name: 'New' }));

/**
 * Gives each store of the mock its one saved build back.
 */
export const resetStoresMock = () => {
  biosoldierStore.builds = [SNIPER_BUILD];
  mecStore.builds = [GOLIATH_BUILD];
  shivStore.builds = [SHIV_BUILD];
};

/**
 * Widget of Build calculators: stores over the builds of the mock, and components with nothing to render.
 */
export const BUILD_CALCULATOR_MOCK = {
  useBiosoldierBuildsStore: () => biosoldierStore,
  useMecBuildsStore: () => mecStore,
  useShivBuildsStore: () => shivStore,
  BiosoldierBuildTree: {},
  BiosoldierClassIcon: {},
  BiosoldierMiniTree: {},
  MecBuildTree: {},
  MecMiniTree: {},
  OfficerRankBadge: {},
  ShivBuildTree: {},
  ShivMiniTree: {},
};

export const SNIPER_OPTION = { id: 'sniper', kind: 'biosoldier', name: 'Sniper', icon: {}, soldierClass: SNIPER } as NewBuildOption;

export const GOLIATH_OPTION = { id: 'goliath', kind: 'mec', name: 'Goliath', icon: {}, soldierClass: GOLIATH } as NewBuildOption;

export const SHIV_OPTION: NewBuildOption = { id: 'shiv', kind: 'shiv', name: 'SHIV', icon: null, soldierClass: null };

export const NEW_SNIPER_SQUAD_BUILD = { kind: 'biosoldier', build: { ...SNIPER_BUILD, id: 'new', name: 'New' } };

export const NEW_GOLIATH_SQUAD_BUILD = { kind: 'mec', build: { ...GOLIATH_BUILD, id: 'new', name: 'New' } };

export const NEW_SHIV_SQUAD_BUILD = { kind: 'shiv', build: { ...SHIV_BUILD, id: 'new', name: 'New' } };
