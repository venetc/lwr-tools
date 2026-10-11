import { describe, expect, it } from 'vitest';

import { storedItemId } from '@shared/lib/stored-list/stored-list';

import { ITEM_ID, ITEM_KEY_PREFIX, ORDER_KEY } from './stored-item-id.mock';

describe('storedItemId', () => {
  it('reads the id of an item key', () => {
    const id = storedItemId(`${ITEM_KEY_PREFIX}${ITEM_ID}`, ITEM_KEY_PREFIX);

    expect(id).toBe(ITEM_ID);
  });

  it('returns null for a key of another record', () => {
    const id = storedItemId(ORDER_KEY, ITEM_KEY_PREFIX);

    expect(id).toBeNull();
  });
});
