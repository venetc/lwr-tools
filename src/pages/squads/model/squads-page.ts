import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

import { useSquadNavItems, useSquadsStore } from '@features/manage-squads';

import { useOpenSquadCheck } from './open-squad-check';
import { squadSummary } from './squad-summary';

/**
 * Squad planner page: the open Squad with its name as a writable value and its summary, the Squad list
 * of the toolbar, and the Squad actions. The Units of the open Squad are checked against their Builds when the page
 * is mounted and whenever another Squad opens.
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

  const { checkOpenSquad } = useOpenSquadCheck();

  /**
   * Opens the Squad and checks its Units against their Builds.
   *
   * @param squadId Squad id.
   */
  const switchSquad = (squadId: string) => {
    squadsStore.switchSquad(squadId);
    checkOpenSquad();
  };

  /**
   * Removes the Squad; the Squad that opens in place of the open one gets its Units checked against their Builds.
   *
   * @param squadId Squad id.
   */
  const removeSquad = (squadId: string) => {
    squadsStore.removeSquad(squadId);
    checkOpenSquad();
  };

  onMounted(checkOpenSquad);

  return {
    openSquad,
    name,
    summary,
    navItems,
    switchSquad,
    addSquad: squadsStore.addSquad,
    removeSquad,
  };
};
