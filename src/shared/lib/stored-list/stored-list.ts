import { useDebounceFn, useEventListener } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import { removeLocalStorage, writeLocalStorage } from '@shared/lib/local-storage';

import { SAVE_DELAY, SAVE_MAX_WAIT } from './constants';
import { loadStoredItems, orderedIds, parseJson, parseStoredOrder, storedItemId } from './stored-records';

export interface StoredListItem {
  /** Item id, unique in the list and part of its storage key. */
  id: string
}

/**
 * List item of the data that can be locked against editing.
 */
export type LockableItem<Data> = Data & StoredListItem & {
  /** Whether the item is locked against editing. */
  readonly: boolean
};

export interface StoredListOptions<Item extends StoredListItem> {
  /** Key of the stored order: a JSON array of item ids; its absence means nothing has been saved yet. */
  orderKey: string
  /** Key prefix of a stored item, followed by the item id. */
  itemKeyPrefix: string
  /** JSON-ready record of the item, or null if the item cannot be stored now: its previous record is kept. */
  serialize: (item: Readonly<Item>) => object | null
  /** Item of a stored record, or null if the record is invalid. */
  parse: (id: string, record: unknown) => Item | null
  /** Items shown and saved while nothing has been saved yet; fixed ids keep tabs opened at once from doubling them. */
  defaultItems: () => Item[]
}

/**
 * Ordered list of items kept in the local storage and synced between tabs: loads the stored items, or the default ones
 * if nothing has been saved yet, and saves every change made through its operations.
 *
 * @description Changes are saved with a debounce and flushed when the page is hidden or closed; changes from other
 * tabs are applied directly to the items and are not saved back. Items are mutated in place by the caller, which then
 * marks them changed.
 *
 * @param options stored list options.
 */
export const useStoredList = <Item extends StoredListItem>(options: StoredListOptions<Item>) => {
  const storedItems = loadStoredItems(options);

  const itemsById = ref(storedItems ?? new Map(options.defaultItems().map(item => [item.id, item]))) as Ref<Map<string, Item>>;

  const changedKeys = new Set<string>();

  /**
   * Saves the current value of the key: the order, or the item record; removes the record of a removed item.
   * An item that cannot be serialized keeps its previous record.
   *
   * @param key storage key.
   */
  const saveKey = (key: string) => {
    if (key === options.orderKey) {
      writeLocalStorage(key, JSON.stringify([...itemsById.value.keys()]));
      return;
    }

    const id = storedItemId(key, options.itemKeyPrefix);

    if (id === null) return;

    const item = itemsById.value.get(id);

    if (!item) {
      removeLocalStorage(key);
      return;
    }

    const record = options.serialize(item);

    if (record === null) return;

    writeLocalStorage(key, JSON.stringify(record));
  };

  /**
   * Saves all changed keys.
   */
  const save = () => {
    changedKeys.forEach(saveKey);
    changedKeys.clear();
  };

  const scheduleSave = useDebounceFn(save, SAVE_DELAY, { maxWait: SAVE_MAX_WAIT });

  /**
   * Marks the key as changed and schedules saving.
   *
   * @param key storage key.
   */
  const markKeyChanged = (key: string) => {
    changedKeys.add(key);
    scheduleSave();
  };

  /**
   * Marks the item as changed, removed items included, and schedules saving.
   *
   * @param id item id.
   */
  const markItemChanged = (id: string) => markKeyChanged(`${options.itemKeyPrefix}${id}`);

  /**
   * Marks the order as changed and schedules saving.
   */
  const markOrderChanged = () => markKeyChanged(options.orderKey);

  /**
   * Item by id, mutable in place; null for a missing item.
   *
   * @param id item id.
   */
  const getItem = (id: string) => itemsById.value.get(id) ?? null;

  /**
   * Adds the item last and saves it.
   *
   * @param item new item.
   */
  const addItem = (item: Item) => {
    itemsById.value.set(item.id, item);
    markItemChanged(item.id);
    markOrderChanged();
  };

  /**
   * Removes the item and its record.
   *
   * @param id item id.
   */
  const removeItem = (id: string) => {
    itemsById.value.delete(id);
    markItemChanged(id);
    markOrderChanged();
  };

  /**
   * Applies an item record saved by another tab: removes the item if the record is removed,
   * otherwise replaces it in place or adds it last. An invalid record is ignored.
   *
   * @param id item id.
   * @param value new record, or null if it is removed.
   */
  const applyStoredItem = (id: string, value: string | null) => {
    if (value === null) {
      itemsById.value.delete(id);
      return;
    }

    const item = options.parse(id, parseJson(value));

    if (!item) return;

    itemsById.value.set(id, item);
  };

  /**
   * Arranges items by the order saved by another tab. Items missing from it stay last, and then the merged order
   * is saved back; ids of items unknown here are not saved back, so tabs do not overwrite each other in turn.
   * An invalid or removed order is ignored.
   *
   * @param value new order, or null if it is removed.
   */
  const applyStoredOrder = (value: string | null) => {
    const order = value === null ? null : parseStoredOrder(value);

    if (!order) return;

    const items = itemsById.value;
    const orderIds = new Set(order);
    const hasMissingItems = [...items.keys()].some(id => !orderIds.has(id));

    itemsById.value = orderedIds(order, [...items.keys()]).reduce((acc, id) => {
      const item = items.get(id);

      if (item) acc.set(id, item);

      return acc;
    }, new Map<string, Item>());

    if (hasMissingItems) markOrderChanged();
  };

  /**
   * Applies a change of the storage made by another tab; keys of other lists and clearing are ignored.
   *
   * @param event storage change.
   */
  const applyStorageChange = (event: StorageEvent) => {
    if (event.key === null) return;

    if (event.key === options.orderKey) {
      applyStoredOrder(event.newValue);
      return;
    }

    const id = storedItemId(event.key, options.itemKeyPrefix);

    if (id === null) return;

    applyStoredItem(id, event.newValue);
    changedKeys.delete(event.key);
  };

  /**
   * Saves pending changes right away when the page is hidden: it may be closed without further events.
   */
  const flushOnHide = () => {
    if (document.visibilityState !== 'hidden') return;

    scheduleSave.flush();
  };

  useEventListener(window, 'storage', applyStorageChange);
  useEventListener(window, 'pagehide', scheduleSave.flush);
  useEventListener(document, 'visibilitychange', flushOnHide);

  if (!storedItems) {
    itemsById.value.forEach(item => markItemChanged(item.id));
    markOrderChanged();
  }

  return {
    items: computed<readonly Item[]>(() => [...itemsById.value.values()]),
    getItem,
    addItem,
    removeItem,
    markItemChanged,
  };
};
