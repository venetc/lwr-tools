import { describe, expect, it, vi } from 'vitest';
import { computed } from 'vue';

import { miniTreeStep, useBiosoldierMiniTree } from '@widgets/build-calculator/model/mini-tree';

import { BIOSOLDIER_BUILD_MOCK, CAPTION, createTierMock, officerRow } from './mini-tree.mock';

vi.mock('@entities/soldier/model/class-tree-tiers', async () => {
  const { CLASS_TREE_TIERS_MOCK } = await import('./mini-tree.mock');

  return { useClassTreeTiers: () => ({ tiers: computed(() => CLASS_TREE_TIERS_MOCK) }) };
});

vi.mock('@entities/soldier/model/gene-mod-tiers', async () => {
  const { GENE_MOD_TIERS_MOCK } = await import('./mini-tree.mock');

  return { useGeneModTiers: () => ({ tiers: computed(() => GENE_MOD_TIERS_MOCK) }) };
});

vi.mock('@entities/soldier/model/psionic-tiers', async () => {
  const { PSIONIC_TIERS_MOCK } = await import('./mini-tree.mock');

  return { usePsionicTiers: () => ({ tiers: computed(() => PSIONIC_TIERS_MOCK) }) };
});

vi.mock('@entities/soldier/model/officer-tiers', async () => {
  const { OFFICER_TIERS_MOCK } = await import('./mini-tree.mock');

  return { useOfficerTiers: () => ({ tiers: computed(() => OFFICER_TIERS_MOCK) }) };
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

  it('titles the officer row as the officer branch', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(officerRow(rows.value)?.title).toBe('Officer');
  });

  it('captions officer steps with the abbreviations of their officer ranks', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(officerRow(rows.value)?.steps.map(({ caption }) => caption)).toEqual(['ALP', 'BET', 'GAM']);
  });

  it('gives officer steps the looks of their officer ranks', () => {
    const rows = useBiosoldierMiniTree(BIOSOLDIER_BUILD_MOCK);

    expect(officerRow(rows.value)?.steps.map(({ state }) => state)).toEqual(['selected', 'open', 'locked']);
  });
});
