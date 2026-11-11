import { storeToRefs } from 'pinia';
import type { MaybeRefOrGetter } from 'vue';
import { computed, shallowRef, toValue } from 'vue';

import type { Loadout, LoadoutItemId } from '@entities/loadout';
import { isSlotRemovable } from '@entities/loadout';
import { useSquadsStore } from '@features/manage-squads';
import { createId } from '@shared/lib/id';
import { useToastQueue } from '@shared/ui/toast';

import { EMPTY_SLOT_NAME, LOCKER_NAME } from '../config/constants';
import { equipLoadoutItem, removeLoadoutItem, utilitySlotFormula } from './loadout-edit';
import type { LockerItem, LockerRow } from './loadout-locker';
import { itemDetails, lockerContents } from './loadout-locker';
import type { LoadoutTile } from './loadout-tiles';
import type { UnitCard } from './unit-cards';

/**
 * Locker of one slot of a Unit: its items in groups, weapons of two tiers or more in a type by tier matrix, the details of the picked item, and the actions that put an item in the
 * slot or take it off. Every action that changes the Loadout closes the Locker.
 *
 * @param card card of the Unit.
 * @param tile tile of the slot.
 * @param style CSS module of the Locker.
 * @param close closes the Locker.
 */
export const useSlotLocker = (
  card: MaybeRefOrGetter<UnitCard>,
  tile: MaybeRefOrGetter<LoadoutTile>,
  style: Record<string, string>,
  close: () => void,
) => {
  const squadsStore = useSquadsStore();

  const { openSquad } = storeToRefs(squadsStore);

  const { showToast } = useToastQueue();

  const pickedId = shallowRef<LoadoutItemId | null>(null);

  const groupIdPrefix = createId();

  const wearer = computed(() => toValue(card).wearer);

  const loadout = computed(() => toValue(card).loadout);

  const slot = computed(() => toValue(tile).slot);

  const formula = computed(() => (slot.value.kind === 'utility' ? utilitySlotFormula(loadout.value) : null));

  const contents = computed(() => lockerContents(slot.value, loadout.value, wearer.value));

  const tiers = computed(() => contents.value.tiers);

  const isMatrix = computed(() => tiers.value.length > 0);

  const matrixStyle = computed(() => ({ '--tier-count': tiers.value.length }));

  const items = computed(() => contents.value.groups.flatMap(group => [
    ...group.rows.flatMap(row => row.cells.filter(cell => cell !== null)),
    ...group.items,
  ]));

  const pickedItem = computed(() => items.value.find(item => item.id === pickedId.value) ?? items.value.find(item => item.isEquipped) ?? null);

  const details = computed(() => {
    if (!pickedItem.value) return null;

    return itemDetails(pickedItem.value.id, slot.value, loadout.value, wearer.value);
  });

  const isEquipShown = computed(() => Boolean(pickedItem.value && !pickedItem.value.isEquipped));

  const isEquipDisabled = computed(() => Boolean(pickedItem.value?.reasons.length));

  const isRemoveShown = computed(() => {
    if (!pickedItem.value?.isEquipped) return false;

    return isSlotRemovable(slot.value, loadout.value, wearer.value);
  });

  const hasReasons = computed(() => Boolean(details.value?.reasons.length));

  const hasGrants = computed(() => Boolean(details.value?.grants.length));

  const hasRules = computed(() => Boolean(details.value?.rules.length));

  /**
   * What the Locker shows of an item: whether it is picked and its classes, those of its state after those of its kind.
   *
   * @param item Locker item.
   * @param kindClasses classes of a list row, a matrix cell or a tile.
   */
  const itemView = (item: LockerItem, kindClasses: string[]) => {
    const isPicked = item.id === pickedItem.value?.id;

    return {
      item,
      isPicked,
      itemClass: [...kindClasses, isPicked ? style.selectedItem : style.idleItem, item.reasons.length ? style.blockedItem : style.fitItem],
    };
  };

  /**
   * Class of a weapon of the matrix: the equipped one is underlined.
   *
   * @param item Locker item.
   */
  const equippedClass = (item: LockerItem) => (item.isEquipped ? style.equippedCell : style.plainCell);

  /**
   * What the Locker shows of an item of a group: a list row with its mark, or a tile with the name in a matrix Locker.
   *
   * @param item Locker item.
   */
  const groupItemView = (item: LockerItem) => {
    if (isMatrix.value) return { ...itemView(item, [style.tile, equippedClass(item)]), markClass: style.tileReason };

    return { ...itemView(item, [style.item]), markClass: item.isEquipped ? style.equippedMark : style.reasonMark };
  };

  /**
   * What the matrix shows of a row: the type name, dimmed when no weapon fits, and its cells.
   *
   * @param row matrix row.
   */
  const rowView = (row: LockerRow) => ({
    key: row.name,
    name: row.name,
    reason: row.reason,
    nameClass: [style.rowName, row.reason ? style.blockedRowName : style.fitRowName],
    cellViews: row.cells.map((cell, index) => ({ key: index, view: cell ? itemView(cell, [style.cell, equippedClass(cell)]) : null })),
  });

  const groupViews = computed(() => {
    const { groups } = contents.value;
    const tierHeadIndex = groups.findIndex(group => group.rows.length);

    return groups.map((group, index) => {
      const titleId = `${groupIdPrefix}-${index}`;

      return {
        key: titleId,
        title: group.title,
        titleId,
        titleClass: [style.groupTitle, index ? style.dividedTitle : style.firstTitle],
        isTierHeadShown: index === tierHeadIndex,
        listClass: isMatrix.value ? style.matrixItems : style.items,
        listAttrs: group.title ? { 'aria-labelledby': titleId } : { 'aria-label': LOCKER_NAME },
        rowViews: group.rows.map(rowView),
        itemViews: group.items.map(groupItemView),
      };
    });
  });

  /**
   * Saves the Loadout of the Unit, closes the Locker, and tells in a toast what else the change did.
   *
   * @param next new Loadout.
   * @param notes what else the change did to the Loadout.
   * @param itemName name of the item now in the slot, or the name of an empty slot.
   */
  const saveLoadout = (next: Loadout, notes: string[], itemName: string) => {
    if (!openSquad.value) return;

    squadsStore.setUnitLoadout(openSquad.value.id, toValue(card).id, next);
    close();

    if (!notes.length) return;

    showToast({ title: `${toValue(tile).caption}: ${itemName}`, description: notes.join(' ') });
  };

  /**
   * Shows the details of a Locker item.
   *
   * @param item Locker item.
   */
  const pickItem = (item: LockerItem) => {
    pickedId.value = item.id;
  };

  /**
   * Puts the item in the slot if it fits and is not there yet; a new armor or primary weapon brings the Loadout to the
   * rules.
   *
   * @param item Locker item.
   */
  const equipItem = (item: LockerItem) => {
    if (item.isEquipped || item.reasons.length) return;

    const result = equipLoadoutItem(loadout.value, slot.value, item.id, wearer.value);

    saveLoadout(result.loadout, result.notes, item.name);
  };

  /**
   * Puts the picked item in the slot.
   */
  const equipPicked = () => {
    if (!pickedItem.value) return;

    equipItem(pickedItem.value);
  };

  /**
   * Empties the slot if its item can be taken off.
   */
  const removePicked = () => {
    if (!isRemoveShown.value) return;

    const result = removeLoadoutItem(loadout.value, slot.value, wearer.value);

    saveLoadout(result.loadout, result.notes, EMPTY_SLOT_NAME);
  };

  return {
    lockerName: LOCKER_NAME,
    formula,
    tiers,
    isMatrix,
    matrixStyle,
    groupViews,
    details,
    isEquipShown,
    isEquipDisabled,
    isRemoveShown,
    hasReasons,
    hasGrants,
    hasRules,
    pickItem,
    equipItem,
    equipPicked,
    removePicked,
  };
};
