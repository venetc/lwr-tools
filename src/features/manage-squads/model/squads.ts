import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { DecodedLoadout } from '@entities/loadout';
import { createId } from '@shared/lib/id';
import { readLocalStorage, writeLocalStorage } from '@shared/lib/local-storage';
import { useStoredList } from '@shared/lib/stored-list';

import { OPEN_SQUAD_KEY, SQUAD_KEY_PREFIX, SQUAD_ORDER_KEY } from '../config/constants';
import type { SquadUnit, SquadUnitBuild } from './squad';
import { createSquad, defaultSquads, isUnitOfBuild, nextSquadName } from './squad';
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
   * Adds a Squad of the Units with the name, which may repeat the name of another Squad, last in the list and opens it;
   * a blank name becomes `Squad N` with the smallest free number.
   *
   * @param name Squad name.
   * @param units builds and Loadouts of the Units in Squad order; each Unit gets its own id and takes its Loadout over.
   */
  const importSquad = (name: string, units: readonly Pick<SquadUnit, 'build' | 'loadout'>[]) => {
    const squad = createSquad(createId(), name.trim() ? name : nextSquadName(squadList.items.value.map(item => item.name)));

    squad.units.push(...units.map(unit => ({ id: createId(), build: { kind: unit.build.kind, id: unit.build.id }, loadout: unit.loadout })));
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
  const addUnit = (squadId: string, build: SquadUnitBuild, loadout: DecodedLoadout) => {
    const squad = squadList.getItem(squadId);

    if (!squad) return;

    squad.units.push({ id: createId(), build: { kind: build.kind, id: build.id }, loadout });
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

  /**
   * Removes the Units of the build with their Loadouts from every Squad, as before the build itself is removed.
   *
   * @param build build the Units refer to.
   */
  const removeBuildUnits = (build: Readonly<SquadUnitBuild>) => {
    for (const squad of squadList.items.value) {
      const unitCount = squad.units.length;

      for (let index = unitCount - 1; index >= 0; index -= 1) {
        const unit = squad.units[index];

        if (unit && isUnitOfBuild(unit, build)) squad.units.splice(index, 1);
      }

      if (squad.units.length !== unitCount) squadList.markItemChanged(squad.id);
    }
  };

  /**
   * Replaces the Loadout of the Unit.
   *
   * @param squadId Squad id.
   * @param unitId Unit id.
   * @param loadout new Loadout; the Unit takes it over.
   */
  const setUnitLoadout = (squadId: string, unitId: string, loadout: DecodedLoadout) => {
    const unit = squadList.getItem(squadId)?.units.find(item => item.id === unitId);

    if (!unit) return;

    unit.loadout = loadout;
    squadList.markItemChanged(squadId);
  };

  /**
   * Replaces the Units of the Squad at once, as after a check of the Units against their builds.
   *
   * @param squadId Squad id.
   * @param units new Units in Squad order; the Squad takes them over.
   */
  const setUnits = (squadId: string, units: SquadUnit[]) => {
    const squad = squadList.getItem(squadId);

    if (!squad) return;

    squad.units = units;
    squadList.markItemChanged(squadId);
  };

  return {
    squads: squadList.items,
    openSquad,
    switchSquad,
    addSquad,
    importSquad,
    renameSquad,
    removeSquad,
    addUnit,
    removeUnit,
    removeBuildUnits,
    setUnitLoadout,
    setUnits,
  };
});
