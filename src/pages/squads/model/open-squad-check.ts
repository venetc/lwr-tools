import { storeToRefs } from 'pinia';

import { useSquadsStore } from '@features/manage-squads';
import { useToastQueue } from '@shared/ui/toast';

import { useSquadBuilds } from './squad-builds';
import { checkSquad, unitCheckToast } from './unit-check';

/**
 * Unit check of the open Squad: what it changed is saved at once, and a toast tells what it took off.
 */
export const useOpenSquadCheck = () => {
  const squadsStore = useSquadsStore();

  const { openSquad } = storeToRefs(squadsStore);

  const { squadBuildsByKey } = useSquadBuilds();

  const { showToast } = useToastQueue();

  /**
   * Brings the Units of the open Squad to their Builds and saves them, the Units whose Build is gone left out; a Unit
   * that nothing fits keeps its Loadout. Tells what was taken off; nothing is saved or told if every Loadout already fits.
   */
  const checkOpenSquad = () => {
    const squad = openSquad.value;

    if (!squad) return;

    const check = checkSquad(squad.units, squadBuildsByKey.value);

    if (!check.isChanged) return;

    const loadoutById = new Map(check.units.map(checked => [checked.unit.id, checked.loadout]));
    const removedIds = new Set(check.removed.map(unit => unit.id));

    squadsStore.setUnits(squad.id, squad.units
      .filter(unit => !removedIds.has(unit.id))
      .map(unit => ({ id: unit.id, build: unit.build, loadout: loadoutById.get(unit.id) ?? unit.loadout })));

    const toast = unitCheckToast(check);

    if (!toast) return;

    showToast(toast);
  };

  return { checkOpenSquad };
};
