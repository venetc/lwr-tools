import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { createId } from '@shared/lib/id';
import { readLocalStorage, writeLocalStorage } from '@shared/lib/local-storage';
import { useStoredList } from '@shared/lib/stored-list';

import { OPEN_SQUAD_KEY, SQUAD_KEY_PREFIX, SQUAD_ORDER_KEY } from '../config/constants';
import type { SquadUnitBuild, UnitLoadout } from './squad';
import { createSquad, defaultSquads, nextSquadName } from './squad';
import { parseSquad, serializeSquad } from './squad-record';

/**
 * Squads of the Squad planner and the open one, kept in the local storage; Squads are synced between tabs,
 * the open Squad is not.
 */
export const useSquadsStore = defineStore('manage-squads-squads', () => {
  const squadList = useStoredList({
    orderKey: SQUAD_ORDER_KEY,
    itemKeyPrefix: SQUAD_KEY_PREFIX,
    serialize: serializeSquad,
    parse: parseSquad,
    defaultItems: defaultSquads,
  });

  const openSquadId = ref(readLocalStorage(OPEN_SQUAD_KEY));

  const openSquad = computed(() => {
    const squad = openSquadId.value === null ? null : squadList.getItem(openSquadId.value);

    return squad ?? squadList.items.value[0] ?? null;
  });

  /**
   * Opens the Squad and remembers it for the next visit.
   *
   * @param squadId Squad id.
   */
  const switchSquad = (squadId: string) => {
    openSquadId.value = squadId;
    writeLocalStorage(OPEN_SQUAD_KEY, squadId);
  };

  /**
   * Adds an empty `Squad N` with the smallest free number and opens it.
   */
  const addSquad = () => {
    const squad = createSquad(createId(), nextSquadName(squadList.items.value.map(item => item.name)));

    squadList.addItem(squad);
    switchSquad(squad.id);
  };

  /**
   * Renames the Squad.
   *
   * @param squadId Squad id.
   * @param name new Squad name.
   */
  const renameSquad = (squadId: string, name: string) => {
    const squad = squadList.getItem(squadId);

    if (!squad) return;

    squad.name = name;
    squadList.markItemChanged(squadId);
  };

  /**
   * Removes the Squad; its builds stay in their Build calculators. The open Squad passes to the one that takes its
   * place in the list, and removing the last Squad adds an empty `Squad 1`.
   *
   * @param squadId Squad id.
   */
  const removeSquad = (squadId: string) => {
    const index = squadList.items.value.findIndex(squad => squad.id === squadId);

    if (index === -1) return;

    const isOpen = openSquad.value?.id === squadId;

    squadList.removeItem(squadId);

    if (squadList.items.value.length === 0) {
      addSquad();
      return;
    }

    if (!isOpen) return;

    const nextSquad = squadList.items.value[Math.min(index, squadList.items.value.length - 1)];

    if (!nextSquad) return;

    switchSquad(nextSquad.id);
  };

  /**
   * Adds a Unit of the build with the Loadout last in the Squad; one build may stand in a Squad more than once.
   *
   * @param squadId Squad id.
   * @param build build the Unit refers to.
   * @param loadout Loadout of the new Unit; the Unit takes it over.
   */
  const addUnit = (squadId: string, build: SquadUnitBuild, loadout: UnitLoadout) => {
    const squad = squadList.getItem(squadId);

    if (!squad) return;

    squad.units.push({ id: createId(), build: { kind: build.kind, id: build.id }, isOfficer: false, loadout });
    squadList.markItemChanged(squadId);
  };

  /**
   * Removes the Unit from the Squad; its build stays in its Build calculator.
   *
   * @param squadId Squad id.
   * @param unitId Unit id.
   */
  const removeUnit = (squadId: string, unitId: string) => {
    const squad = squadList.getItem(squadId);
    const index = squad ? squad.units.findIndex(unit => unit.id === unitId) : -1;

    if (!squad || index === -1) return;

    squad.units.splice(index, 1);
    squadList.markItemChanged(squadId);
  };

  return {
    squads: squadList.items,
    openSquad,
    switchSquad,
    addSquad,
    renameSquad,
    removeSquad,
    addUnit,
    removeUnit,
  };
});
