import type { StoredListOptions } from '@shared/lib/stored-list/stored-list';

export interface ItemMock {
  /** Item id. */
  id: string
  /** Item label. */
  label: string
}

export const ORDER_KEY = 'app.list.v1.order';

export const ITEM_KEY_PREFIX = 'app.list.v1.item.';

/** Fake local storage: values by key, in insertion order. */
export const STORAGE_MOCK = new Map<string, string>();

/**
 * Fills the fake storage with the entries, replacing what it held.
 *
 * @param entries stored values by key.
 */
export const fillStorage = (entries: Record<string, string>) => {
  STORAGE_MOCK.clear();
  Object.entries(entries).forEach(([key, value]) => STORAGE_MOCK.set(key, value));
};

export const LOCAL_STORAGE_MOCK = {
  readLocalStorage: (key: string) => STORAGE_MOCK.get(key) ?? null,
  localStorageKeys: (prefix: string) => [...STORAGE_MOCK.keys()].filter(key => key.startsWith(prefix)),
  writeLocalStorage: () => true,
  removeLocalStorage: () => true,
};

export const OPTIONS_MOCK: StoredListOptions<ItemMock> = {
  orderKey: ORDER_KEY,
  itemKeyPrefix: ITEM_KEY_PREFIX,
  serialize: item => ({ label: item.label }),
  parse: (id, record) => {
    if (typeof record !== 'object' || record === null || !('label' in record) || typeof record.label !== 'string') return null;

    return { id, label: record.label };
  },
  defaultItems: () => [],
};

export const ORDERED_STORAGE = {
  'app.list.v1.order': '["b","a"]',
  'app.list.v1.item.a': '{"label":"A"}',
  'app.list.v1.item.c': '{"label":"C"}',
  'app.list.v1.item.b': '{"label":"B"}',
};

export const ORDERED_ITEMS = [
  { id: 'b', label: 'B' },
  { id: 'a', label: 'A' },
  { id: 'c', label: 'C' },
];

export const BROKEN_JSON_STORAGE = {
  'app.list.v1.order': '["a","b"]',
  'app.list.v1.item.a': '{"label":',
  'app.list.v1.item.b': '{"label":"B"}',
};

export const REJECTED_RECORD_STORAGE = {
  'app.list.v1.order': '["a","b"]',
  'app.list.v1.item.a': '{"label":1}',
  'app.list.v1.item.b': '{"label":"B"}',
};

export const VALID_ITEMS = [{ id: 'b', label: 'B' }];

export const BROKEN_ORDER_STORAGE = {
  'app.list.v1.order': '{"a":1}',
  'app.list.v1.item.b': '{"label":"B"}',
};
