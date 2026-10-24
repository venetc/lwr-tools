import { describe, expect, it, vi } from 'vitest';

import { psiLevelState } from '@entities/soldier/model/psi-levels';

import { SELECTED_ABILITY } from './psi-levels.mock';

vi.mock('@entities/soldier/config/constants/ability-content', () => ({ ABILITY_CONTENT: {} }));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

describe('psiLevelState', () => {
  it('gives completed for a psi level with a psionic ability', () => {
    const state = psiLevelState(SELECTED_ABILITY, false, false);

    expect(state).toBe('completed');
  });

  it('gives completed for a psi level with a psionic ability of a readonly build', () => {
    const state = psiLevelState(SELECTED_ABILITY, true, false);

    expect(state).toBe('completed');
  });

  it('gives available for an empty psi level of an editable build', () => {
    const state = psiLevelState(null, false, false);

    expect(state).toBe('available');
  });

  it('gives locked for an empty psi level of a readonly build', () => {
    const state = psiLevelState(null, true, false);

    expect(state).toBe('locked');
  });

  it('gives locked for an empty psi level a Build rule blocks', () => {
    const state = psiLevelState(null, false, true);

    expect(state).toBe('locked');
  });

  it('gives locked for a psi level with a psionic ability a Build rule blocks', () => {
    const state = psiLevelState(SELECTED_ABILITY, false, true);

    expect(state).toBe('locked');
  });
});
