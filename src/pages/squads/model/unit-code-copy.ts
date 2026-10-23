import { useClipboard } from '@vueuse/core';

import { encodeUnit } from '@features/share-build';
import { useToastQueue } from '@shared/ui/toast';

import { buildListName } from './squad-build';
import type { UnitCard } from './unit-cards';

/**
 * Copying the Share code of a Unit of the open Squad, confirmed with a toast that tells where the code goes; one
 * clipboard serves every card.
 */
export const useUnitCodeCopy = () => {
  const { copy } = useClipboard({ legacy: true });

  const { showToast } = useToastQueue();

  /**
   * Copies the Share code of the Unit of the card, its build with its Loadout, to the clipboard and tells about it.
   *
   * @param card card of the Unit.
   */
  const copyUnitCode = async (card: UnitCard) => {
    const { squadBuild, loadout } = card;
    const code = encodeUnit({ kind: squadBuild.kind, build: squadBuild.build, loadout });

    if (code === null) return;

    await copy(code);

    showToast({
      title: 'Unit code copied',
      description: `Paste it in Add Unit to add ${squadBuild.build.name} with its Loadout, or in ${buildListName(squadBuild.kind)} to get the Build.`,
    });
  };

  return { copyUnitCode };
};
