import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useStoredList } from '@shared/lib/stored-list';

import {
  ADDED_ITEMS,
  ADDED_STORAGE,
  BROKEN_JSON_STORAGE,
  BROKEN_ORDER_STORAGE,
  changeInOtherTab,
  changeVisibility,
  closePage,
  createOptionsMock,
  DEFAULT_ITEMS,
  DEFAULT_STORAGE,
  EDIT_INTERVAL,
  EMPTY_STORAGE,
  INVALID_ORDER,
  INVALID_RECORD,
  ITEM_A_KEY,
  ITEM_N_KEY,
  MERGED_STORAGE,
  NEW_ITEM,
  NEW_ITEM_RECORD,
  ORDER_KEY,
  ORDERED_ITEMS,
  ORDERED_STORAGE,
  OTHER_LIST_KEY,
  OTHER_TAB_ITEMS,
  OTHER_TAB_RECORD,
  OTHER_TAB_STORAGE,
  PARTIAL_ORDER,
  REJECTED_RECORD_STORAGE,
  relabelItem,
  REMAINING_ITEMS,
  REMOVED_STORAGE,
  RENAMED_STORAGE,
  REVERSED_ITEMS,
  REVERSED_ORDER,
  REVERSED_STORAGE,
  SAVE_DELAY,
  SAVE_MAX_WAIT,
  STALE_RECORD_STORAGE,
  storedEntries,
  stubPage,
  VALID_ITEMS,
} from './stored-list.mock';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useStoredList: nothing saved yet', () => {
  it('shows the default items', () => {
    stubPage();

    const list = useStoredList(createOptionsMock());

    expect(list.items.value).toEqual(DEFAULT_ITEMS);
  });

  it('saves the default items and their order after the delay', () => {
    const page = stubPage();
    useStoredList(createOptionsMock());

    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(DEFAULT_STORAGE);
  });

  it('writes nothing before the delay', () => {
    const page = stubPage();
    useStoredList(createOptionsMock());

    vi.advanceTimersByTime(SAVE_DELAY - 1);

    expect(storedEntries(page)).toEqual({});
  });
});

describe('useStoredList: loading', () => {
  it('loads the items in the stored order, records outside the order last', () => {
    stubPage(ORDERED_STORAGE);

    const list = useStoredList(createOptionsMock());

    expect(list.items.value).toEqual(ORDERED_ITEMS);
  });

  it('skips a record that is not valid JSON', () => {
    stubPage(BROKEN_JSON_STORAGE);

    const list = useStoredList(createOptionsMock());

    expect(list.items.value).toEqual(VALID_ITEMS);
  });

  it('skips a record the parser rejects', () => {
    stubPage(REJECTED_RECORD_STORAGE);

    const list = useStoredList(createOptionsMock());

    expect(list.items.value).toEqual(VALID_ITEMS);
  });

  it('restores the records when the order is invalid', () => {
    stubPage(BROKEN_ORDER_STORAGE);

    const list = useStoredList(createOptionsMock());

    expect(list.items.value).toEqual(VALID_ITEMS);
  });

  it('shows no default items once an empty list has been saved', () => {
    stubPage(EMPTY_STORAGE);

    const list = useStoredList(createOptionsMock());

    expect(list.items.value).toEqual([]);
  });

  it('writes nothing back after loading', () => {
    const page = stubPage(ORDERED_STORAGE);
    useStoredList(createOptionsMock());

    vi.runAllTimers();

    expect(storedEntries(page)).toEqual(ORDERED_STORAGE);
  });
});

describe('useStoredList: saving', () => {
  it('saves an added item and the order after the delay', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());
    list.addItem({ ...NEW_ITEM });

    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(ADDED_STORAGE);
  });

  it('saves an item changed in place after the delay', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    relabelItem(list, 'a', 'Renamed');
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(RENAMED_STORAGE);
  });

  it('saves during continuous editing once the longest wait is over', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    for (let time = 0; time < SAVE_MAX_WAIT; time += EDIT_INTERVAL) {
      relabelItem(list, 'a', 'Renamed');
      vi.advanceTimersByTime(EDIT_INTERVAL);
    }

    expect(storedEntries(page)).toEqual(RENAMED_STORAGE);
  });

  it('keeps the previous record of an item that cannot be stored now', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    relabelItem(list, 'a', '');
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(DEFAULT_STORAGE);
  });

  it('gives null for a missing item', () => {
    stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    const item = list.getItem('missing');

    expect(item).toBeNull();
  });
});

describe('useStoredList: removing', () => {
  it('removes the item', () => {
    stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    list.removeItem('a');

    expect(list.items.value).toEqual(REMAINING_ITEMS);
  });

  it('removes the record of the item and saves the order after the delay', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());
    list.removeItem('a');

    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(REMOVED_STORAGE);
  });

  it('leaves the items when a missing item is removed', () => {
    stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    list.removeItem('missing');

    expect(list.items.value).toEqual(DEFAULT_ITEMS);
  });

  it('removes the record of an item marked changed that is not in the list', () => {
    const page = stubPage(STALE_RECORD_STORAGE);
    const list = useStoredList(createOptionsMock());
    list.markItemChanged('x');

    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(DEFAULT_STORAGE);
  });
});

describe('useStoredList: leaving the page', () => {
  it('saves pending changes at once when the page is closed', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());
    relabelItem(list, 'a', 'Renamed');

    closePage(page);

    expect(storedEntries(page)).toEqual(RENAMED_STORAGE);
  });

  it('saves pending changes at once when the page is hidden', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());
    relabelItem(list, 'a', 'Renamed');

    changeVisibility(page, 'hidden');

    expect(storedEntries(page)).toEqual(RENAMED_STORAGE);
  });

  it('waits for the delay when the page is shown again', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());
    relabelItem(list, 'a', 'Renamed');

    changeVisibility(page, 'visible');

    expect(storedEntries(page)).toEqual(DEFAULT_STORAGE);
  });
});

describe('useStoredList: items changed in another tab', () => {
  it('replaces a changed item', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ITEM_A_KEY, OTHER_TAB_RECORD);

    expect(list.items.value).toEqual(OTHER_TAB_ITEMS);
  });

  it('adds a new item last', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ITEM_N_KEY, NEW_ITEM_RECORD);

    expect(list.items.value).toEqual(ADDED_ITEMS);
  });

  it('removes an item whose record is removed', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ITEM_A_KEY, null);

    expect(list.items.value).toEqual(REMAINING_ITEMS);
  });

  it('ignores an invalid record', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ITEM_A_KEY, INVALID_RECORD);

    expect(list.items.value).toEqual(DEFAULT_ITEMS);
  });

  it('ignores a key of another list', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, OTHER_LIST_KEY, OTHER_TAB_RECORD);

    expect(list.items.value).toEqual(DEFAULT_ITEMS);
  });

  it('keeps the items when the storage is cleared', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, null, null);

    expect(list.items.value).toEqual(DEFAULT_ITEMS);
  });

  it('keeps the record the other tab saved over a pending change of the item', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());
    relabelItem(list, 'a', 'Renamed');
    changeInOtherTab(page, ITEM_A_KEY, OTHER_TAB_RECORD);

    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(OTHER_TAB_STORAGE);
  });
});

describe('useStoredList: order changed in another tab', () => {
  it('arranges the items by the new order', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ORDER_KEY, REVERSED_ORDER);

    expect(list.items.value).toEqual(REVERSED_ITEMS);
  });

  it('does not save back an order that holds every item', () => {
    const page = stubPage(DEFAULT_STORAGE);
    useStoredList(createOptionsMock());
    changeInOtherTab(page, ORDER_KEY, REVERSED_ORDER);

    vi.runAllTimers();

    expect(storedEntries(page)).toEqual(REVERSED_STORAGE);
  });

  it('keeps the items missing from the order last', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ORDER_KEY, PARTIAL_ORDER);

    expect(list.items.value).toEqual(REVERSED_ITEMS);
  });

  it('saves back the merged order without the ids unknown here', () => {
    const page = stubPage(DEFAULT_STORAGE);
    useStoredList(createOptionsMock());
    changeInOtherTab(page, ORDER_KEY, PARTIAL_ORDER);

    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedEntries(page)).toEqual(MERGED_STORAGE);
  });

  it('ignores an invalid order', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ORDER_KEY, INVALID_ORDER);

    expect(list.items.value).toEqual(DEFAULT_ITEMS);
  });

  it('keeps the items when the order is removed', () => {
    const page = stubPage(DEFAULT_STORAGE);
    const list = useStoredList(createOptionsMock());

    changeInOtherTab(page, ORDER_KEY, null);

    expect(list.items.value).toEqual(DEFAULT_ITEMS);
  });
});
