import { describe, expect, it } from 'vitest';

import { miniTreeStep } from '@widgets/build-calculator/model/mini-tree';

import { CAPTION, createTierMock } from './mini-tree.mock';

describe('miniTreeStep', () => {
  it('shows the selected icon of the item chosen on the tier', () => {
    const step = miniTreeStep(createTierMock('completed', 'right'), CAPTION);

    expect(step.icon).toBe('right-selected.png');
  });

  it('marks a tier with a selection as selected', () => {
    const step = miniTreeStep(createTierMock('completed', 'right'), CAPTION);

    expect(step.state).toBe('selected');
  });

  it('names the tier and the chosen item', () => {
    const step = miniTreeStep(createTierMock('completed', 'right'), CAPTION);

    expect(step.label).toBe('First step: Right');
  });

  it('shows no icon on an empty tier', () => {
    const step = miniTreeStep(createTierMock('available', null), CAPTION);

    expect(step.icon).toBeNull();
  });

  it('marks an empty tier open for selection as open', () => {
    const step = miniTreeStep(createTierMock('available', null), CAPTION);

    expect(step.state).toBe('open');
  });

  it('names an empty open tier as empty', () => {
    const step = miniTreeStep(createTierMock('available', null), CAPTION);

    expect(step.label).toBe('First step: Empty');
  });

  it('marks an empty locked tier as locked', () => {
    const step = miniTreeStep(createTierMock('locked', null), CAPTION);

    expect(step.state).toBe('locked');
  });

  it('names an empty locked tier as locked', () => {
    const step = miniTreeStep(createTierMock('locked', null), CAPTION);

    expect(step.label).toBe('First step: Locked');
  });

  it('marks a completed tier whose selection is not among its items as locked', () => {
    const step = miniTreeStep(createTierMock('completed', 'missing'), CAPTION);

    expect(step.state).toBe('locked');
  });

  it('keeps the caption of the step', () => {
    const step = miniTreeStep(createTierMock('completed', 'right'), CAPTION);

    expect(step.caption).toBe('FST');
  });
});
