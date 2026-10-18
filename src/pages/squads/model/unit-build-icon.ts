import type { MaybeRefOrGetter } from 'vue';
import { computed } from 'vue';

import type { SquadBuild } from './squad-build';
import { useKindBuilds } from './unit-build';

/**
 * Class icon of the build: the biosoldier build for its icon in branch colours, or the MEC class icon; a SHIV has none.
 *
 * @param squadBuild build of the icon.
 */
export const useUnitBuildIcon = (squadBuild: MaybeRefOrGetter<SquadBuild>) => {
  const { biosoldierBuild, mecBuild } = useKindBuilds(squadBuild);

  const classIcon = computed(() => mecBuild.value?.soldierClass.icon ?? null);

  return { biosoldierBuild, classIcon };
};
