import { describe, expect, it } from 'vitest';

import { orderedIds } from '@shared/lib/stored-list/stored-list';

describe('orderedIds', () => {
  it('arranges the ids by the order', () => {
    const ids = orderedIds(['c', 'a', 'b'], ['a', 'b', 'c']);

    expect(ids).toEqual(['c', 'a', 'b']);
  });

  it('puts ids missing from the order last', () => {
    const ids = orderedIds(['b'], ['a', 'b', 'c']);

    expect(ids).toEqual(['b', 'a', 'c']);
  });

  it('skips ids of the order that are not present', () => {
    const ids = orderedIds(['x', 'a'], ['a']);

    expect(ids).toEqual(['a']);
  });

  it('keeps the first place of a duplicated id', () => {
    const ids = orderedIds(['b', 'a', 'b'], ['a', 'b']);

    expect(ids).toEqual(['b', 'a']);
  });
});
