import { useClipboard } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';

import { useSquadsStore } from '@features/manage-squads';
import { encodeSquad } from '@features/share-build';
import { useToastQueue } from '@shared/ui/toast';

import { squadCodeCopyBlock } from './code-copy-block';
import type { UnitCard } from './unit-cards';

/**
 * Copying the Share code of the open Squad, its name and the Units of its cards with their Loadouts, confirmed with
 * a toast that tells where the code goes. A Squad with Units of Outdated builds is not copied: a toast lists them.
 *
 * @param unitCards cards of the Units of the open Squad, in Squad order.
 */
export const useSquadCodeCopy = (unitCards: Readonly<Ref<readonly UnitCard[]>>) => {
  const { openSquad } = storeToRefs(useSquadsStore());

  const { copy } = useClipboard({ legacy: true });

  const { showToast } = useToastQueue();

  /**
   * Copies the Share code of the open Squad to the clipboard and tells about it; for a Squad with Outdated builds only
   * tells which ones keep it from being copied.
   */
  const copySquadCode = async () => {
    const block = squadCodeCopyBlock(unitCards.value);

    if (block) {
      showToast(block);
      return;
    }

    const squad = openSquad.value;
    const code = squad && encodeSquad({
      name: squad.name,
      units: unitCards.value.map(card => ({ kind: card.squadBuild.kind, build: card.squadBuild.build, loadout: card.loadout })),
    });

    if (!squad || !code) return;

    await copy(code);

    showToast({ title: 'Squad code copied', description: `Paste it in Import of the Squad planner to get ${squad.name} with new Builds.` });
  };

  return { copySquadCode };
};
