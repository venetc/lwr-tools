import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useSquadsStore } from '@features/manage-squads';
import { useToastQueue } from '@shared/ui/toast';

import type { LoadoutTile } from './loadout-tiles';
import { loadoutTiles } from './loadout-tiles';
import type { SquadBuild } from './squad-build';
import { buildListName, squadBuildCaption, unitWearer } from './squad-build';
import { useSquadBuilds } from './squad-builds';

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
  /** Loadout tiles in inventory order. */
  tiles: LoadoutTile[]
}

/**
 * Cards of the Units of the open Squad, in Squad order, and their removal. A Unit whose build is no longer saved has no
 * card until the check of the Squad removes it.
 */
export const useUnitCards = () => {
  const squadsStore = useSquadsStore();

  const { openSquad } = storeToRefs(squadsStore);

  const { findSquadBuild } = useSquadBuilds();

  const { showToast } = useToastQueue();

  const unitCards = computed(() => (openSquad.value?.units ?? []).flatMap((unit): UnitCard[] => {
    const squadBuild = findSquadBuild(unit.build);

    if (!squadBuild) return [];

    return [{
      id: unit.id,
      squadBuild,
      caption: squadBuildCaption(squadBuild),
      tiles: loadoutTiles(unit.loadout, unitWearer(squadBuild, unit.isOfficer)),
    }];
  }));

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
