import { storeToRefs } from 'pinia';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, nextTick, ref, shallowRef, toValue } from 'vue';

import type { Loadout, LoadoutItemId } from '@entities/loadout';
import { useSquadsStore } from '@features/manage-squads';
import { useToastQueue } from '@shared/ui/toast';

import { EMPTY_SLOT_NAME } from '../config/constants';
import { completeLoadout, equipLoadoutItem, isSlotRemovable, removeLoadoutItem, utilitySlotFormula } from './loadout-edit';
import type { LockerItem } from './loadout-locker';
import { itemDetails, lockerItems } from './loadout-locker';
import type { LoadoutTile } from './loadout-tiles';
import { loadoutTiles } from './loadout-tiles';
import type { UnitCard } from './unit-cards';

/**
 * Loadout dialog of a Unit: INVENTORY with the selected slot, the LOCKER of that slot, the details of the picked item,
 * and the actions that put items on and take them off. On a phone INVENTORY and LOCKER are separate screens, and focus
 * follows the screen shown: the back button of LOCKER, or the row of the slot in INVENTORY.
 *
 * @param card card of the Unit.
 * @param initialSlotId id of the tile the dialog was opened from; it is selected first.
 * @param backButton back button of LOCKER, shown on a phone only.
 * @param style CSS module of the dialog content.
 */
export const useLoadoutEditor = (
  card: MaybeRefOrGetter<UnitCard>,
  initialSlotId: MaybeRefOrGetter<string>,
  backButton: Readonly<Ref<HTMLButtonElement | null>>,
  style: Record<string, string>,
) => {
  const squadsStore = useSquadsStore();

  const { openSquad } = storeToRefs(squadsStore);

  const { showToast } = useToastQueue();

  const slotId = ref(toValue(initialSlotId));

  const pickedId = shallowRef<LoadoutItemId | null>(null);

  const isLockerShown = ref(false);

  const wearer = computed(() => toValue(card).wearer);

  const rowElements = new Map<string, HTMLElement>();

  const loadout = computed(() => completeLoadout(toValue(card).loadout, wearer.value));

  const tiles = computed(() => (loadout.value ? loadoutTiles(loadout.value, wearer.value) : toValue(card).tiles));

  const selectedTile = computed(() => tiles.value.find(tile => tile.id === slotId.value) ?? tiles.value[0] ?? null);

  const slotFormula = computed(() => (loadout.value ? utilitySlotFormula(loadout.value, wearer.value) : ''));

  const items = computed(() => {
    if (!loadout.value || !selectedTile.value) return [];

    return lockerItems(selectedTile.value.slot, loadout.value, wearer.value);
  });

  const pickedItem = computed(() => items.value.find(item => item.id === pickedId.value) ?? items.value.find(item => item.isEquipped) ?? null);

  const details = computed(() => {
    if (!pickedItem.value || !selectedTile.value || !loadout.value) return null;

    return itemDetails(pickedItem.value.id, selectedTile.value.slot, loadout.value, wearer.value);
  });

  const isEquipShown = computed(() => Boolean(pickedItem.value && !pickedItem.value.isEquipped));

  const isEquipDisabled = computed(() => Boolean(pickedItem.value?.reasons.length));

  const isRemoveShown = computed(() => {
    if (!pickedItem.value?.isEquipped || !selectedTile.value || !loadout.value) return false;

    return isSlotRemovable(selectedTile.value.slot, loadout.value, wearer.value);
  });

  const hasReasons = computed(() => Boolean(details.value?.reasons.length));

  const hasGrants = computed(() => Boolean(details.value?.grants.length));

  const hasRules = computed(() => Boolean(details.value?.rules.length));

  const rows = computed(() => tiles.value.map((tile, index, list) => ({
    tile,
    name: tile.item?.name ?? EMPTY_SLOT_NAME,
    isSelected: tile.id === selectedTile.value?.id,
    hasFormulaBefore: tile.slot.kind === 'utility' && list[index - 1]?.slot.kind !== 'utility',
    rowClass: [style.row, tile.id === selectedTile.value?.id ? style.selectedRow : style.idleRow],
  })));

  const itemViews = computed(() => items.value.map(item => ({
    item,
    isPicked: item.id === pickedItem.value?.id,
    itemClass: [style.item, item.id === pickedItem.value?.id ? style.selectedItem : style.idleItem, item.reasons.length ? style.blockedItem : style.fitItem],
    markClass: item.isEquipped ? style.equippedMark : style.reasonMark,
  })));

  const lockerCaption = computed(() => selectedTile.value?.caption ?? '');

  const lockerTone = computed(() => selectedTile.value?.tone ?? 'regular');

  const inventoryClass = computed(() => [style.inventory, isLockerShown.value ? style.hiddenPane : style.shownPane]);

  const lockerClass = computed(() => [style.locker, isLockerShown.value ? style.shownPane : style.hiddenPane]);

  /**
   * Saves the Loadout of the Unit.
   *
   * @param next new Loadout.
   */
  const saveLoadout = (next: Loadout) => {
    if (!openSquad.value) return;

    squadsStore.setUnitLoadout(openSquad.value.id, toValue(card).id, next);
  };

  /**
   * Template ref of an INVENTORY row: keeps its element to give it focus on the way back from LOCKER.
   *
   * @param id tile id of the row.
   */
  const rowRef = (id: string) => (element: unknown) => {
    if (element instanceof HTMLElement) {
      rowElements.set(id, element);
      return;
    }

    rowElements.delete(id);
  };

  /**
   * Selects the slot of an INVENTORY row and shows its LOCKER; on a phone the LOCKER takes the screen and its back
   * button takes focus, while on wider screens the button is hidden and focus stays on the row.
   *
   * @param tile tile of the slot.
   */
  const selectSlot = async (tile: LoadoutTile) => {
    slotId.value = tile.id;
    pickedId.value = null;
    isLockerShown.value = true;

    await nextTick();

    backButton.value?.focus();
  };

  /**
   * Returns to INVENTORY on a phone and gives focus to the row of the selected slot.
   */
  const showInventory = async () => {
    isLockerShown.value = false;

    await nextTick();

    rowElements.get(selectedTile.value?.id ?? '')?.focus();
  };

  /**
   * Shows the details of a LOCKER item.
   *
   * @param item LOCKER item.
   */
  const pickItem = (item: LockerItem) => {
    pickedId.value = item.id;
  };

  /**
   * Puts the item in the selected slot if it fits and is not there yet; a new armor or primary weapon brings the Loadout
   * to the rules, and a toast tells what else changed.
   *
   * @param item LOCKER item.
   */
  const equipItem = (item: LockerItem) => {
    const tile = selectedTile.value;

    if (!loadout.value || !tile || item.isEquipped || item.reasons.length) return;

    const result = equipLoadoutItem(loadout.value, tile.slot, item.id, wearer.value);

    pickedId.value = item.id;
    saveLoadout(result.loadout);

    if (!result.notes.length) return;

    showToast({ title: `${tile.caption}: ${item.name}`, description: result.notes.join(' ') });
  };

  /**
   * Puts the picked item in the selected slot.
   */
  const equipPicked = () => {
    if (!pickedItem.value) return;

    equipItem(pickedItem.value);
  };

  /**
   * Empties the selected slot if its item can be taken off.
   */
  const removePicked = () => {
    const tile = selectedTile.value;

    if (!loadout.value || !tile || !isRemoveShown.value) return;

    const result = removeLoadoutItem(loadout.value, tile.slot, wearer.value);

    saveLoadout(result.loadout);

    if (!result.notes.length) return;

    showToast({ title: `${tile.caption}: ${EMPTY_SLOT_NAME}`, description: result.notes.join(' ') });
  };

  return {
    slotFormula,
    rows,
    itemViews,
    details,
    isEquipShown,
    isEquipDisabled,
    isRemoveShown,
    hasReasons,
    hasGrants,
    hasRules,
    lockerCaption,
    lockerTone,
    inventoryClass,
    lockerClass,
    rowRef,
    selectSlot,
    showInventory,
    pickItem,
    equipItem,
    equipPicked,
    removePicked,
  };
};
