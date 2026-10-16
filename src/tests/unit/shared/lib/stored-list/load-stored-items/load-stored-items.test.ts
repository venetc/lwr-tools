import { describe, expect, it, vi } from 'vitest';

import { loadStoredItems } from '@shared/lib/stored-list/stored-records';

import {
  BROKEN_JSON_STORAGE,
  BROKEN_ORDER_STORAGE,
  fillStorage,
  OPTIONS_MOCK,
  ORDERED_ITEMS,
  ORDERED_STORAGE,
  REJECTED_RECORD_STORAGE,
  VALID_ITEMS,
} from './load-stored-items.mock';

vi.mock('@shared/lib/local-storage', async () => (await import('./load-stored-items.mock')).LOCAL_STORAGE_MOCK);

describe('loadStoredItems', () => {
  it('returns null when nothing has been saved', () => {
    fillStorage({});

    const items = loadStoredItems(OPTIONS_MOCK);

    expect(items).toBeNull();
  });

  it('loads the items in the stored order, records outside the order last', () => {
    fillStorage(ORDERED_STORAGE);

    const items = loadStoredItems(OPTIONS_MOCK);

    expect([...items?.values() ?? []]).toEqual(ORDERED_ITEMS);
  });

  it('skips a record that is not valid JSON', () => {
    fillStorage(BROKEN_JSON_STORAGE);

    const items = loadStoredItems(OPTIONS_MOCK);

    expect([...items?.values() ?? []]).toEqual(VALID_ITEMS);
  });

  it('skips a record the parser rejects', () => {
    fillStorage(REJECTED_RECORD_STORAGE);

    const items = loadStoredItems(OPTIONS_MOCK);

    expect([...items?.values() ?? []]).toEqual(VALID_ITEMS);
  });

  it('restores the records when the order is invalid', () => {
    fillStorage(BROKEN_ORDER_STORAGE);

    const items = loadStoredItems(OPTIONS_MOCK);

    expect([...items?.values() ?? []]).toEqual(VALID_ITEMS);
  });
});
