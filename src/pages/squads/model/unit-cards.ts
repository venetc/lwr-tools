import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import type { Loadout, LoadoutWearer } from '@entities/loadout';
import { useSquadsStore } from '@features/manage-squads';
import { useToastQueue } from '@shared/ui/toast';

import type { LoadoutTile } from './loadout-tiles';
import { loadoutTiles } from './loadout-tiles';
import type { SquadBuild } from './squad-build';
import { buildListName, squadBuildCaption, squadBuildKey } from './squad-build';
import { useSquadBuilds } from './squad-builds';
import { checkSquad, unitCheckBuildLines } from './unit-check';

/**
 * Unit of the open Squad as its card shows it.
 */
export interface UnitCard {
  /** Unit id. */
  id: string
  /** Build of the Unit. */
  squadBuild: SquadBuild
  /** Unit type and class of the build. */
  caption: string
  /** Whether the build is an Outdated build: the Unit check skips the Unit until the update. */
  isOutdated: boolean
  /** What the Loadout rules need to know about the Unit. */
  wearer: LoadoutWearer
  /** Loadout of the Unit brought to the rules of its Build. */
  loadout: Loadout
  /** Loadout tiles in inventory order. */
  tiles: LoadoutTile[]
  /** What closing the Build dialog takes off the Units of the Build: its line of the Unit check toast; null if nothing. */
  closeNote: string | null
}

/**
 * Cards of the Units of the open Squad, in Squad order, and their removal. Units are read through the Unit check, so
 * every card shows a Loadout that fits its Build, and tells what saving the check would take off the Units of its Build;
 * a Unit of an Outdated build shows its Loadout as it is, and a Unit whose build is no longer saved has no card.
 */
export const useUnitCards = () => {
  const squadsStore = useSquadsStore();

  const { openSquad } = storeToRefs(squadsStore);

  const { squadBuildsByKey } = useSquadBuilds();

  const { showToast } = useToastQueue();

  const unitCards = computed(() => {
    const check = checkSquad(openSquad.value?.units ?? [], squadBuildsByKey.value);
    const buildLines = unitCheckBuildLines(check);

    return check.units.map((checked): UnitCard => ({
      id: checked.unit.id,
      squadBuild: checked.squadBuild,
      caption: squadBuildCaption(checked.squadBuild),
      isOutdated: checked.isOutdated,
      wearer: checked.wearer,
      loadout: checked.loadout,
      tiles: loadoutTiles(checked.loadout, checked.wearer),
      closeNote: buildLines.get(squadBuildKey(checked.unit.build)) ?? null,
    }));
  });

  /**
   * Removes the Unit of the card from the open Squad and tells that its build stays in its Build calculator.
   *
   * @param card card of the Unit.
   */
  const removeUnit = (card: UnitCard) => {
    const squad = openSquad.value;

    if (!squad) return;

    squadsStore.removeUnit(squad.id, card.id);

    showToast({
      title: 'Unit removed',
      description: `${card.squadBuild.build.name} removed from ${squad.name}. The Build stays in ${buildListName(card.squadBuild.kind)}.`,
    });
  };

  return { unitCards, removeUnit };
};
