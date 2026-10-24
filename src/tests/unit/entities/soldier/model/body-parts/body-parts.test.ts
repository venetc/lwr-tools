import { describe, expect, it, vi } from 'vitest';

import { bodyPartState } from '@entities/soldier/model/body-parts';

import { SELECTED_GENE_MOD } from './body-parts.mock';

vi.mock('@entities/soldier/config/constants/ability-content', () => ({ ABILITY_CONTENT: {} }));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

describe('bodyPartState', () => {
  it('gives completed for a body part with a gene mod', () => {
    const state = bodyPartState(SELECTED_GENE_MOD, false);

    expect(state).toBe('completed');
  });

  it('gives completed for a body part with a gene mod of a readonly build', () => {
    const state = bodyPartState(SELECTED_GENE_MOD, true);

    expect(state).toBe('completed');
  });

  it('gives available for an empty body part of an editable build', () => {
    const state = bodyPartState(null, false);

    expect(state).toBe('available');
  });

  it('gives locked for an empty body part of a readonly build', () => {
    const state = bodyPartState(null, true);

    expect(state).toBe('locked');
  });
});
