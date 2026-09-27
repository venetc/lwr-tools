import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, shallowRef, toValue } from 'vue';

import { lastSelectedTalent } from './build';
import { firstTalent } from './tree';
import type { Talent, TalentBuild, TalentTreeData } from './types';

/**
 * Талант в панели описания: последний осмотренный, иначе последний выбранный, иначе первый в дереве.
 *
 * @param tree дерево талантов класса.
 * @param build выбранные таланты по рангам.
 */
export function useDescribedTalent(tree: MaybeRefOrGetter<TalentTreeData>, build: Ref<TalentBuild>) {
  const inspectedTalent = shallowRef<Talent | null>(null);

  const describedTalent = computed(() => {
    const treeValue = toValue(tree);
    return inspectedTalent.value ?? lastSelectedTalent(treeValue, build.value) ?? firstTalent(treeValue);
  });

  const hasGrants = computed(() => (describedTalent.value?.grants.length ?? 0) > 0);

  /**
   * Показывает талант в панели описания.
   *
   * @param talent осмотренный пользователем талант.
   */
  function describe(talent: Talent) {
    inspectedTalent.value = talent;
  }

  return { describedTalent, hasGrants, describe };
}
