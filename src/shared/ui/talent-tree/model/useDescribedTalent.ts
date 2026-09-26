import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { Talent, TalentBuild, TalentTreeData } from './types';

import { computed, shallowRef, toValue } from 'vue';

import { lastSelectedTalent } from './build';
import { firstTalent } from './tree';

export interface UseDescribedTalent {
  descriptionName: ComputedRef<string>
  descriptionText: ComputedRef<string>
  descriptionKey: ComputedRef<string>
  descriptionGrants: ComputedRef<Talent[]>
  hasDescriptionGrants: ComputedRef<boolean>
  describe: (talent: Talent) => void
}

export function useDescribedTalent(tree: MaybeRefOrGetter<TalentTreeData>, build: Ref<TalentBuild>): UseDescribedTalent {
  const inspectedTalent = shallowRef<Talent | null>(null);

  const describedTalent = computed(() => {
    const treeValue = toValue(tree);
    return inspectedTalent.value ?? lastSelectedTalent(treeValue, build.value) ?? firstTalent(treeValue);
  });

  const descriptionName = computed(() => describedTalent.value?.name ?? '');
  const descriptionText = computed(() => describedTalent.value?.description ?? '');
  const descriptionKey = computed(() => describedTalent.value?.id ?? 'none');
  const descriptionGrants = computed(() => describedTalent.value?.grants ?? []);
  const hasDescriptionGrants = computed(() => descriptionGrants.value.length > 0);

  function describe(talent: Talent) {
    inspectedTalent.value = talent;
  }

  return { descriptionName, descriptionText, descriptionKey, descriptionGrants, hasDescriptionGrants, describe };
}
