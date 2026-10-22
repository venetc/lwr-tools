import { vi } from 'vitest';

import type { StoredListOptions, useStoredList } from '@shared/lib/stored-list';

export interface ItemMock {
  /** Item id. */
  id: string
  /** Item label; an empty label cannot be stored. */
  label: string
}

/** Delay after the last change before items are saved, in milliseconds. */
export const SAVE_DELAY = 300;

/** Longest time changes wait to be saved during continuous editing, in milliseconds. */
export const SAVE_MAX_WAIT = 2000;

export const ORDER_KEY = 'app.list.v1.order';

export const ITEM_KEY_PREFIX = 'app.list.v1.item.';

/**
 * Page environment of the stored list: local storage in memory, the window and the document as plain event targets.
 */
export interface PageMock {
  /** Stored values by key, in insertion order. */
  values: Map<string, string>
  /** Window the list listens to for storage changes and page closing. */
  window: EventTarget
  /** Document the list listens to for page hiding. */
  document: EventTarget & { visibilityState: DocumentVisibilityState }
}

/**
 * Local storage over the values: the part of the Storage interface the app uses.
 *
 * @param values stored values by key.
 */
const createStorageMock = (values: Map<string, string>) => ({
  get length() {
    return values.size;
  },
  key: (index: number) => [...values.keys()][index] ?? null,
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => {
    values.set(key, value);
  },
  removeItem: (key: string) => {
    values.delete(key);
  },
});

/**
 * Stubs the global local storage, window and document with fresh in-memory ones.
 *
 * @param entries values stored before the page opens, by key.
 */
export const stubPage = (entries: Record<string, string> = {}): PageMock => {
  const page: PageMock = {
    values: new Map(Object.entries(entries)),
    window: new EventTarget(),
    document: Object.assign(new EventTarget(), { visibilityState: 'visible' as DocumentVisibilityState }),
  };

  vi.stubGlobal('localStorage', createStorageMock(page.values));
  vi.stubGlobal('window', page.window);
  vi.stubGlobal('document', page.document);

  return page;
};

/**
 * Stored values by key as a plain object.
 *
 * @param page page environment.
 */
export const storedEntries = (page: PageMock) => Object.fromEntries(page.values);

/**
 * Writes the value of the key, removes the key for a null value, or clears the storage for a null key.
 *
 * @param page page environment.
 * @param key changed key, or null to clear the storage.
 * @param value new value, or null if it is removed.
 */
const writeValue = (page: PageMock, key: string | null, value: string | null) => {
  if (key === null) {
    page.values.clear();
    return;
  }

  if (value === null) {
    page.values.delete(key);
    return;
  }

  page.values.set(key, value);
};

/**
 * Writes or removes the value as another tab does and tells this tab about it with a storage event.
 *
 * @param page page environment.
 * @param key changed key, or null when another tab clears the storage.
 * @param value new value, or null if it is removed.
 */
export const changeInOtherTab = (page: PageMock, key: string | null, value: string | null) => {
  writeValue(page, key, value);
  page.window.dispatchEvent(Object.assign(new Event('storage'), { key, newValue: value }));
};

/**
 * Changes the visibility of the page and tells the document about it.
 *
 * @param page page environment.
 * @param visibilityState new visibility of the page.
 */
export const changeVisibility = (page: PageMock, visibilityState: DocumentVisibilityState) => {
  page.document.visibilityState = visibilityState;
  page.document.dispatchEvent(new Event('visibilitychange'));
};

/**
 * Tells the window that the page is being closed.
 *
 * @param page page environment.
 */
export const closePage = (page: PageMock) => {
  page.window.dispatchEvent(new Event('pagehide'));
};

/**
 * Stored list options of labeled items with fresh default items `a` and `b`.
 */
export const createOptionsMock = (): StoredListOptions<ItemMock> => ({
  orderKey: ORDER_KEY,
  itemKeyPrefix: ITEM_KEY_PREFIX,
  serialize: item => (item.label ? { label: item.label } : null),
  parse: (id, record) => {
    if (typeof record !== 'object' || record === null || !('label' in record) || typeof record.label !== 'string') return null;

    return { id, label: record.label };
  },
  defaultItems: () => [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
});

export const DEFAULT_ITEMS = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }];

export const DEFAULT_STORAGE = {
  'app.list.v1.item.a': '{"label":"A"}',
  'app.list.v1.item.b': '{"label":"B"}',
  'app.list.v1.order': '["a","b"]',
};

export const ORDERED_STORAGE = {
  'app.list.v1.order': '["c","a"]',
  'app.list.v1.item.a': '{"label":"A"}',
  'app.list.v1.item.d': '{"label":"D"}',
  'app.list.v1.item.c': '{"label":"C"}',
};

export const ORDERED_ITEMS = [{ id: 'c', label: 'C' }, { id: 'a', label: 'A' }, { id: 'd', label: 'D' }];

export const BROKEN_JSON_STORAGE = {
  'app.list.v1.order': '["a","c"]',
  'app.list.v1.item.a': '{"label":',
  'app.list.v1.item.c': '{"label":"C"}',
};

export const REJECTED_RECORD_STORAGE = {
  'app.list.v1.order': '["a","c"]',
  'app.list.v1.item.a': '{"label":1}',
  'app.list.v1.item.c': '{"label":"C"}',
};

export const BROKEN_ORDER_STORAGE = {
  'app.list.v1.order': '{"a":1}',
  'app.list.v1.item.c': '{"label":"C"}',
};

export const EMPTY_STORAGE = { 'app.list.v1.order': '[]' };

export const VALID_ITEMS = [{ id: 'c', label: 'C' }];

export const NEW_ITEM = { id: 'n', label: 'N' };

export const ADDED_STORAGE = {
  ...DEFAULT_STORAGE,
  'app.list.v1.item.n': '{"label":"N"}',
  'app.list.v1.order': '["a","b","n"]',
};

export const RENAMED_STORAGE = { ...DEFAULT_STORAGE, 'app.list.v1.item.a': '{"label":"Renamed"}' };

/** Interval of continuous edits, shorter than the save delay, in milliseconds. */
export const EDIT_INTERVAL = 200;

/**
 * Changes the label of the item in place and marks it changed, as a caller of the list does; a missing item is skipped.
 *
 * @param list stored list of labeled items.
 * @param id item id.
 * @param label new label.
 */
export const relabelItem = (list: ReturnType<typeof useStoredList<ItemMock>>, id: string, label: string) => {
  const item = list.getItem(id);

  if (!item) return;

  item.label = label;
  list.markItemChanged(id);
};

export const REMOVED_STORAGE = {
  'app.list.v1.item.b': '{"label":"B"}',
  'app.list.v1.order': '["b"]',
};

export const REMAINING_ITEMS = [{ id: 'b', label: 'B' }];

export const STALE_RECORD_STORAGE = { ...DEFAULT_STORAGE, 'app.list.v1.item.x': '{"label":1}' };

export const ITEM_A_KEY = 'app.list.v1.item.a';

export const ITEM_N_KEY = 'app.list.v1.item.n';

export const OTHER_LIST_KEY = 'app.other.v1.item.a';

/** Record of another tab with a field this tab does not know: saving it back would lose the field. */
export const OTHER_TAB_RECORD = '{"label":"Other tab","note":"newer"}';

export const OTHER_TAB_ITEMS = [{ id: 'a', label: 'Other tab' }, { id: 'b', label: 'B' }];

export const OTHER_TAB_STORAGE = { ...DEFAULT_STORAGE, 'app.list.v1.item.a': '{"label":"Other tab","note":"newer"}' };

export const ADDED_ITEMS = [...DEFAULT_ITEMS, { id: 'n', label: 'N' }];

export const NEW_ITEM_RECORD = '{"label":"N"}';

export const INVALID_RECORD = '{"label":';

/** Order saved by another tab that knows item `z` unknown here. */
export const REVERSED_ORDER = '["z","b","a"]';

export const REVERSED_ITEMS = [{ id: 'b', label: 'B' }, { id: 'a', label: 'A' }];

export const REVERSED_STORAGE = { ...DEFAULT_STORAGE, 'app.list.v1.order': '["z","b","a"]' };

/** Order saved by another tab that has not seen item `a` yet. */
export const PARTIAL_ORDER = '["z","b"]';

export const MERGED_STORAGE = { ...DEFAULT_STORAGE, 'app.list.v1.order': '["b","a"]' };

export const INVALID_ORDER = '{"a":1}';
