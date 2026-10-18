import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { SquadBuild } from './squad-build';

/**
 * Class icon of the build: the biosoldier build for its icon in branch colours, or the MEC class icon; a SHIV has none.
 *
 * @param squadBuild build of the icon.
 */
export const useUnitBuildIcon = (squadBuild: MaybeRefOrGetter<SquadBuild>) => {
  const biosoldierBuild = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'biosoldier' ? value.build : null;
  });

  const classIcon = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'mec' ? value.build.soldierClass.icon : null;
  });

  return { biosoldierBuild, classIcon };
};
