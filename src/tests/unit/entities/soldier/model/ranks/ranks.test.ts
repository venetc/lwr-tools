import { describe, expect, it } from 'vitest';

import { highestSelectedStepIndex, rankState } from '@entities/soldier/model/ranks';

import { EMPTY_STEPS, GAPPED_STEPS, SELECTED_PERK } from './ranks.mock';

describe('rankState', () => {
  it('gives completed for a rank with a selection', () => {
    const state = rankState(SELECTED_PERK, false);

    expect(state).toBe('completed');
  });

  it('gives completed for a rank with a selection of a readonly build', () => {
    const state = rankState(SELECTED_PERK, true);

    expect(state).toBe('completed');
  });

  it('gives available for an empty rank of an editable build', () => {
    const state = rankState(null, false);

    expect(state).toBe('available');
  });

  it('gives locked for an empty rank of a readonly build', () => {
    const state = rankState(null, true);

    expect(state).toBe('locked');
  });
});

describe('highestSelectedStepIndex', () => {
  it('gives the highest step with a selection above an empty one', () => {
    const index = highestSelectedStepIndex(GAPPED_STEPS);

    expect(index).toBe(2);
  });

  it('gives -1 without selections', () => {
    const index = highestSelectedStepIndex(EMPTY_STEPS);

    expect(index).toBe(-1);
  });
});
