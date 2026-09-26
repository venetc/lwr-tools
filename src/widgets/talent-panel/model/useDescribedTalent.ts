import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { Talent, TalentBuild, TalentTree } from '@entities/talent';

import { computed, shallowRef, toValue } from 'vue';

import { firstTalent, lastSelectedTalent } from '@entities/talent';

export interface UseDescribedTalent {
  descriptionName: ComputedRef<string>
  descriptionText: ComputedRef<string>
  descriptionKey: ComputedRef<string>
  describe: (talent: Talent) => void
}

export function useDescribedTalent(tree: MaybeRefOrGetter<TalentTree>, build: Ref<TalentBuild>): UseDescribedTalent {
  const inspectedTalent = shallowRef<Talent | null>(null);

  const describedTalent = computed(() => {
    const treeValue = toValue(tree);
    return inspectedTalent.value ?? lastSelectedTalent(treeValue, build.value) ?? firstTalent(treeValue);
  });

  const descriptionName = computed(() => describedTalent.value?.name ?? '');
  const descriptionText = computed(() => describedTalent.value?.description ?? '');
  const descriptionKey = computed(() => describedTalent.value?.id ?? 'none');

  function describe(talent: Talent) {
    inspectedTalent.value = talent;
  }

  return { descriptionName, descriptionText, descriptionKey, describe };
}
