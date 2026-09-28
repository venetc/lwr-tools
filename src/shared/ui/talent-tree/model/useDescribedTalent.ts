import type { MaybeRefOrGetter } from 'vue';
import { computed, shallowRef, toValue, watch } from 'vue';

import type { Talent, TalentBuild, TalentTreeData } from '@shared/lib/talent-tree';
import { firstTalent, lastSelectedTalent } from '@shared/lib/talent-tree';

/**
 * Talent shown in the description panel: the last inspected one, otherwise the last selected one, otherwise the first in the tree.
 * A tree change forgets the inspected talent.
 *
 * @param tree class talent tree.
 * @param build selected talents by rank.
 */
export const useDescribedTalent = (tree: MaybeRefOrGetter<TalentTreeData>, build: MaybeRefOrGetter<TalentBuild>) => {
  const inspectedTalent = shallowRef<Talent | null>(null);

  watch(() => toValue(tree), () => {
    inspectedTalent.value = null;
  });

  const describedTalent = computed(() => {
    const treeValue = toValue(tree);
    return inspectedTalent.value ?? lastSelectedTalent(treeValue, toValue(build)) ?? firstTalent(treeValue);
  });

  const hasGrants = computed(() => (describedTalent.value?.grants.length ?? 0) > 0);

  /**
   * Shows the talent in the description panel.
   *
   * @param talent talent inspected by the user.
   */
  const describe = (talent: Talent) => {
    inspectedTalent.value = talent;
  };

  return { describedTalent, hasGrants, describe };
};
