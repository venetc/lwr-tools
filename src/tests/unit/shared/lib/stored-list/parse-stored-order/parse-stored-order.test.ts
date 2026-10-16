import { describe, expect, it } from 'vitest';

import { parseStoredOrder } from '@shared/lib/stored-list/stored-records';

import { INVALID_JSON_VALUE, NOT_A_LIST_VALUE, ORDER_IDS, ORDER_VALUE } from './parse-stored-order.mock';

describe('parseStoredOrder', () => {
  it('reads the item ids', () => {
    const order = parseStoredOrder(ORDER_VALUE);

    expect(order).toEqual(ORDER_IDS);
  });

  it('returns null for invalid JSON', () => {
    const order = parseStoredOrder(INVALID_JSON_VALUE);

    expect(order).toBeNull();
  });

  it('returns null for a value that is not a list of ids', () => {
    const order = parseStoredOrder(NOT_A_LIST_VALUE);

    expect(order).toBeNull();
  });
});
