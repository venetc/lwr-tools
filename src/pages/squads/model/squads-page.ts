import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useSquadNavItems, useSquadsStore } from '@features/manage-squads';

import { squadSummary } from './squad-summary';

/**
 * Squad planner page: the open Squad with its name as a writable value and its summary, the Squad list
 * of the toolbar, and the Squad actions.
 */
export const useSquadsPage = () => {
  const squadsStore = useSquadsStore();

  const { squads, openSquad } = storeToRefs(squadsStore);

  const name = computed({
    get: () => openSquad.value?.name ?? '',
    set: (value: string) => {
      if (!openSquad.value) return;

      squadsStore.renameSquad(openSquad.value.id, value);
    },
  });

  const summary = computed(() => squadSummary(openSquad.value?.units ?? []));

  const navItems = useSquadNavItems(squads, () => openSquad.value?.id ?? null);

  return {
    openSquad,
    name,
    summary,
    navItems,
    switchSquad: squadsStore.switchSquad,
    addSquad: squadsStore.addSquad,
    removeSquad: squadsStore.removeSquad,
  };
};
