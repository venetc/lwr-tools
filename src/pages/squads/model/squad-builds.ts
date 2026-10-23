import { computed } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';
import type { SquadUnitBuild } from '@features/manage-squads';

import type { NewBuildOption } from './new-build';
import type { SquadBuild, SquadBuildOf } from './squad-build';
import { squadBuildKey } from './squad-build';
import { SQUAD_BUILD_KINDS } from './squad-build-kinds';

/**
 * Saved builds of the Build calculator of the kind, with their kind.
 *
 * @param kind kind of the builds.
 */
const kindSquadBuilds = <Kind extends LoadoutUnitId>(kind: Kind) => {
  return SQUAD_BUILD_KINDS[kind].builds().map((build): SquadBuildOf<Kind> => ({ kind, build }));
};

/**
 * Saved builds of all three Build calculators, as Units refer to them: as a list and by `squadBuildKey`.
 */
export const useSquadBuilds = () => {
  const squadBuilds = computed<SquadBuild[]>(() => [
    ...kindSquadBuilds('biosoldier'),
    ...kindSquadBuilds('mec'),
    ...kindSquadBuilds('shiv'),
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
   * @returns kind and id of the new build; null if the option has no class its Build calculator needs.
   */
  const addDefaultBuild = (option: NewBuildOption): SquadUnitBuild | null => {
    const id = SQUAD_BUILD_KINDS[option.kind].addDefaultBuild(option.soldierClass);

    return id ? { kind: option.kind, id } : null;
  };

  return { squadBuilds, squadBuildsByKey, findSquadBuild, addDefaultBuild };
};
