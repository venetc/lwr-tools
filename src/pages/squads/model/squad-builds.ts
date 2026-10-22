import { computed } from 'vue';

import type { SquadUnitBuild } from '@features/manage-squads';
import { useBiosoldierBuildsStore, useMecBuildsStore, useShivBuildsStore } from '@widgets/build-calculator';

import type { NewBuildOption } from './new-build';
import type { SquadBuild } from './squad-build';
import { squadBuildKey } from './squad-build';

/**
 * Saved builds of all three Build calculators, as Units refer to them: as a list and by `squadBuildKey`.
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

  const squadBuildsByKey = computed<ReadonlyMap<string, SquadBuild>>(() => new Map(
    squadBuilds.value.map(squadBuild => [
      squadBuildKey({ kind: squadBuild.kind, id: squadBuild.build.id }),
      squadBuild,
    ]),
  ));

  /**
   * Saved build a Unit refers to; null if it is no longer saved.
   *
   * @param build kind and id of the build.
   */
  const findSquadBuild = (build: Readonly<SquadUnitBuild>) => squadBuildsByKey.value.get(squadBuildKey(build)) ?? null;

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

  return { squadBuilds, squadBuildsByKey, findSquadBuild, addDefaultBuild };
};
