import { localStorageKeys, readLocalStorage } from '@shared/lib/local-storage';

import { ORDER_SCHEMA } from './constants';

export interface StoredListItem {
  /** Item id, unique in the list and part of its storage key. */
  id: string
}

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
 * Parsed JSON value, or null if the text is not valid JSON.
 *
 * @param value JSON text.
 */
export const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/**
 * Item id of the storage key, or null if the key is not an item key.
 *
 * @param key storage key.
 * @param itemKeyPrefix key prefix of stored items.
 */
export const storedItemId = (key: string, itemKeyPrefix: string) => {
  if (!key.startsWith(itemKeyPrefix)) return null;

  return key.slice(itemKeyPrefix.length);
};

/**
 * Item ids of the stored order, or null if the order is not valid JSON or not an array of strings.
 *
 * @param value stored order.
 */
export const parseStoredOrder = (value: string) => {
  const order = ORDER_SCHEMA.safeParse(parseJson(value));

  if (!order.success) return null;

  return order.data;
};

/**
 * Item ids arranged by the order: ids of the order that are present first, without duplicates,
 * then the remaining ids in their own order. Ids of the order that are not present are skipped.
 *
 * @param order item ids in the desired order.
 * @param ids present item ids.
 */
export const orderedIds = (order: string[], ids: string[]) => {
  const presentIds = new Set(ids);
  const result = new Set(order.filter(id => presentIds.has(id)));

  ids.forEach(id => result.add(id));

  return [...result];
};

/**
 * Stored items by id in the stored order, records outside the order last; null if nothing has been saved yet.
 *
 * @param options stored list options.
 */
export const loadStoredItems = <Item extends StoredListItem>(options: StoredListOptions<Item>) => {
  const orderValue = readLocalStorage(options.orderKey);

  if (orderValue === null) return null;

  const storedIds = localStorageKeys(options.itemKeyPrefix)
    .map(key => storedItemId(key, options.itemKeyPrefix))
    .filter(id => id !== null);

  return orderedIds(parseStoredOrder(orderValue) ?? [], storedIds).reduce((acc, id) => {
    const value = readLocalStorage(`${options.itemKeyPrefix}${id}`);
    const item = value === null ? null : options.parse(id, parseJson(value));

    if (item) acc.set(id, item);

    return acc;
  }, new Map<string, Item>());
};
