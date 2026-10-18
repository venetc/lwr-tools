import { computed } from 'vue';

import type { SquadUnitBuild } from '@features/manage-squads';
import { useBiosoldierBuildsStore, useMecBuildsStore, useShivBuildsStore } from '@widgets/build-calculator';

import type { NewBuildOption } from './new-build';
import type { SquadBuild } from './squad-build';

/**
 * Saved builds of all three Build calculators, as Units refer to them.
 */
export const useSquadBuilds = () => {
  const biosoldierBuildsStore = useBiosoldierBuildsStore();
  const mecBuildsStore = useMecBuildsStore();
  const shivBuildsStore = useShivBuildsStore();

  const squadBuilds = computed<SquadBuild[]>(() => [
    ...biosoldierBuildsStore.builds.map((build): SquadBuild => ({ kind: 'biosoldier', build })),
    ...mecBuildsStore.builds.map((build): SquadBuild => ({ kind: 'mec', build })),
    ...shivBuildsStore.builds.map((build): SquadBuild => ({ kind: 'shiv', build })),
  ]);

  /**
   * Saved build a Unit refers to; null if it is no longer saved.
   *
   * @param build kind and id of the build.
   */
  const findSquadBuild = (build: Readonly<SquadUnitBuild>) => (
    squadBuilds.value.find(squadBuild => squadBuild.kind === build.kind && squadBuild.build.id === build.id) ?? null
  );

  /**
   * Adds a Default build of the option to its Build calculator.
   *
   * @param option class of a biosoldier or MEC, or a SHIV.
   * @returns kind and id of the new build.
   */
  const addDefaultBuild = (option: NewBuildOption): SquadUnitBuild => {
    if (option.kind === 'shiv') return { kind: 'shiv', id: shivBuildsStore.addBuild() };

    if (option.kind === 'mec') return { kind: 'mec', id: mecBuildsStore.addBuild(option.soldierClass) };

    return { kind: 'biosoldier', id: biosoldierBuildsStore.addBuild(option.soldierClass) };
  };

  return { squadBuilds, findSquadBuild, addDefaultBuild };
};
