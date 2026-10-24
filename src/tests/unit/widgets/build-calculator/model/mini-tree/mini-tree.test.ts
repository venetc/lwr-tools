import { describe, expect, it, vi } from 'vitest';
import { computed } from 'vue';

import { miniTreeStep, useBiosoldierMiniTree } from '@widgets/build-calculator/model/mini-tree';

import { BIOSOLDIER_BUILD_MOCK, branchRow, CAPTION, createTierMock } from './mini-tree.mock';

vi.mock('@widgets/build-calculator/model/biosoldier-branches', async () => {
  const { BRANCHES_MOCK } = await import('./mini-tree.mock');

  return { useBiosoldierBranches: () => ({ branches: computed(() => BRANCHES_MOCK) }) };
});

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

  it('marks a tier whose selection is an Outdated selection as outdated', () => {
    const step = miniTreeStep(createTierMock('completed', 'right', ['right']), CAPTION);

    expect(step.state).toBe('outdated');
  });

  it('shows the selected icon of an Outdated selection', () => {
    const step = miniTreeStep(createTierMock('completed', 'right', ['right']), CAPTION);

    expect(step.icon).toBe('right-selected.png');
  });

  it('names the tier and its Outdated selection', () => {
    const step = miniTreeStep(createTierMock('completed', 'right', ['right']), CAPTION);

    expect(step.label).toBe('First step: Right, outdated selection');
  });

  it('names every Outdated selection of a tier in the order of its items', () => {
    const step = miniTreeStep(createTierMock('completed', 'right', ['right', 'left']), CAPTION);

    expect(step.label).toBe('First step: Left and Right, outdated selections');
  });

  it('keeps the caption of the step', () => {
    const step = miniTreeStep(createTierMock('completed', 'right'), CAPTION);

    expect(step.caption).toBe('FST');
  });
});

describe('useBiosoldierMiniTree', () => {
  it('shows the class tree, the gene mods, the psionic abilities and the officer tree as rows', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(rows.value.map(({ id }) => id)).toEqual(['class-tree', 'gene-mods', 'psionic', 'officer']);
  });

  it('captions officer steps with the abbreviations of their officer ranks', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(branchRow(rows.value, 'officer')?.steps.map(({ caption }) => caption)).toEqual(['ALP', 'BET', 'GAM']);
  });

  it('gives officer steps the looks of their officer ranks', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(branchRow(rows.value, 'officer')?.steps.map(({ state }) => state)).toEqual(['selected', 'open', 'locked']);
  });

  it('captions class tree steps with short rank names', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(branchRow(rows.value, 'class-tree')?.steps.map(({ caption }) => caption)).toEqual(['SPC']);
  });

  it('captions gene mod steps with the names of their body parts', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(branchRow(rows.value, 'gene-mods')?.steps.map(({ caption }) => caption)).toEqual(['Head']);
  });

  it('titles each row as its branch', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(rows.value.map(({ title }) => title)).toEqual(['Class tree', 'Gene mods', 'Psionic', 'Officer']);
  });
});
