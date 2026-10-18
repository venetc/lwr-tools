import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';

import type { SquadBuild } from './squad-build';

/**
 * Build of a Unit by its kind: the build of the kind it is, null for the other kinds.
 *
 * @param squadBuild build of the Unit.
 */
export const useKindBuilds = (squadBuild: MaybeRefOrGetter<SquadBuild>) => {
  const biosoldierBuild = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'biosoldier' ? value.build : null;
  });

  const mecBuild = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'mec' ? value.build : null;
  });

  const shivBuild = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'shiv' ? value.build : null;
  });

  return { biosoldierBuild, mecBuild, shivBuild };
};

/**
 * Build of a Unit card: the build of its kind for the mini-tree and the Build dialog, and whether the dialog is open.
 *
 * @param squadBuild build of the Unit.
 */
export const useUnitBuild = (squadBuild: MaybeRefOrGetter<SquadBuild>) => {
  const { biosoldierBuild, mecBuild, shivBuild } = useKindBuilds(squadBuild);

  const isOpen = ref(false);

  /**
   * Opens the Build dialog.
   */
  const openBuild = () => {
    isOpen.value = true;
  };

  return { biosoldierBuild, mecBuild, shivBuild, isOpen, openBuild };
};
