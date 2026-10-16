import { describe, expect, it } from 'vitest';

import { rankState } from '@entities/soldier/model/ranks';

import { BASE_BUILD, PARTIAL_BUILD } from './ranks.mock';

describe('rankState', () => {
  it('gives completed for a rank below the build length', () => {
    const state = rankState(PARTIAL_BUILD, 1, false);

    expect(state).toBe('completed');
  });

  it('gives available for the next rank of an editable build', () => {
    const state = rankState(PARTIAL_BUILD, 2, false);

    expect(state).toBe('available');
  });

  it('gives locked for the next rank of a readonly build', () => {
    const state = rankState(PARTIAL_BUILD, 2, true);

    expect(state).toBe('locked');
  });

  it('gives locked for a rank after the next one', () => {
    const state = rankState(BASE_BUILD, 2, false);

    expect(state).toBe('locked');
  });
});
