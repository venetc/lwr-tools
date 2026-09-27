import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, shallowRef, toValue } from 'vue';

import { lastSelectedTalent } from './build';
import { firstTalent } from './tree';
import type { Talent, TalentBuild, TalentTreeData } from './types';

/**
 * Talent shown in the description panel: the last inspected one, otherwise the last selected one, otherwise the first in the tree.
 *
 * @param tree class talent tree.
 * @param build selected talents by rank.
 */
export function useDescribedTalent(tree: MaybeRefOrGetter<TalentTreeData>, build: Ref<TalentBuild>) {
  const inspectedTalent = shallowRef<Talent | null>(null);

  const describedTalent = computed(() => {
    const treeValue = toValue(tree);
    return inspectedTalent.value ?? lastSelectedTalent(treeValue, build.value) ?? firstTalent(treeValue);
  });

  const hasGrants = computed(() => (describedTalent.value?.grants.length ?? 0) > 0);

  /**
   * Shows the talent in the description panel.
   *
   * @param talent talent inspected by the user.
   */
  function describe(talent: Talent) {
    inspectedTalent.value = talent;
  }

  return { describedTalent, hasGrants, describe };
}
