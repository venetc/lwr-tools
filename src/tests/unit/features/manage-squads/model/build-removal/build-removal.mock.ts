import type { DecodedLoadout } from '@entities/loadout';

export const LOADOUT: DecodedLoadout = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null], modules: [] };

export const SQUAD_BUILD = { kind: 'biosoldier', id: 'build-1' } as const;

export const FREE_BUILD_ID = 'build-2';

export const TITLE = 'Delete «Sniper»?';

export const NOTE = 'It is in Squads: Squad 1 (2 Units). These 2 Units and their Loadouts will be removed.';

/**
 * Build calculator with two builds whose removal takes the build out of its list.
 */
export const createCalculator = () => {
  const builds = [{ id: 'build-1', name: 'Sniper' }, { id: 'build-2', name: 'Assault' }];

  /**
   * Removes the build from the list.
   *
   * @param buildId build id.
   */
  const removeBuild = (buildId: string) => {
    const index = builds.findIndex(build => build.id === buildId);

    if (index !== -1) builds.splice(index, 1);
  };

  return { builds, removeBuild };
};
