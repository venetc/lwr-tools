import { describe, expect, it, vi } from 'vitest';

import { geneModBlockReason, officerPerkBlockReason, perkBlockReason, psionicAbilityBlockReason } from '@entities/soldier/model/build-rules';

import { EMPTY_BUILD, HIGH_PSIONIC_BUILD, NEURAL_DAMPING_BUILD, SOLDIER_BUILD } from './build-rules.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./build-rules.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./build-rules.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/psi-level-content', async () => ({
  PSI_LEVEL_CONTENT: (await import('./build-rules.mock')).PSI_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./build-rules.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/officer-rank-content', async () => ({
  OFFICER_RANK_CONTENT: (await import('./build-rules.mock')).OFFICER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {}, OFFICER_RANK_MEDAL_PLACEHOLDER: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('perkBlockReason', () => {
  it('allows a perk of the rank', () => {
    const reason = perkBlockReason(SOLDIER_BUILD, 1, 'right');

    expect(reason).toBeNull();
  });

  it('allows clearing a rank above the first one', () => {
    const reason = perkBlockReason(SOLDIER_BUILD, 1, null);

    expect(reason).toBeNull();
  });

  it('refuses clearing the rank of the base perk', () => {
    const reason = perkBlockReason(SOLDIER_BUILD, 0, null);

    expect(reason).toBe('base-perk');
  });

  it('refuses a perk of another rank', () => {
    const reason = perkBlockReason(SOLDIER_BUILD, 1, 'granted');

    expect(reason).toBe('not-offered');
  });

  it('refuses a rank outside the class tree', () => {
    const reason = perkBlockReason(SOLDIER_BUILD, 2, null);

    expect(reason).toBe('not-offered');
  });
});

describe('geneModBlockReason', () => {
  it('allows a gene mod of the body part', () => {
    const reason = geneModBlockReason(EMPTY_BUILD, 1, 'feet-second');

    expect(reason).toBeNull();
  });

  it('allows Neural Damping without psionic abilities', () => {
    const reason = geneModBlockReason(EMPTY_BUILD, 0, 'neural-damping');

    expect(reason).toBeNull();
  });

  it('refuses Neural Damping while a psionic ability is selected above an empty psi level', () => {
    const reason = geneModBlockReason(HIGH_PSIONIC_BUILD, 0, 'neural-damping');

    expect(reason).toBe('psionic-ability');
  });

  it('allows the other gene mod of the brain while a psionic ability is selected', () => {
    const reason = geneModBlockReason(HIGH_PSIONIC_BUILD, 0, 'head-second');

    expect(reason).toBeNull();
  });

  it('allows clearing a body part', () => {
    const reason = geneModBlockReason(HIGH_PSIONIC_BUILD, 0, null);

    expect(reason).toBeNull();
  });

  it('refuses a gene mod of another body part', () => {
    const reason = geneModBlockReason(EMPTY_BUILD, 0, 'feet-first');

    expect(reason).toBe('not-offered');
  });

  it('refuses a body part outside the build', () => {
    const reason = geneModBlockReason(EMPTY_BUILD, 2, null);

    expect(reason).toBe('not-offered');
  });
});

describe('psionicAbilityBlockReason', () => {
  it('allows a psionic ability of the psi level', () => {
    const reason = psionicAbilityBlockReason(EMPTY_BUILD, 0, 'low-right');

    expect(reason).toBeNull();
  });

  it('allows the psi level itself without Neural Damping', () => {
    const reason = psionicAbilityBlockReason(EMPTY_BUILD, 1, null);

    expect(reason).toBeNull();
  });

  it('blocks the psi level itself while Neural Damping is selected', () => {
    const reason = psionicAbilityBlockReason(NEURAL_DAMPING_BUILD, 1, null);

    expect(reason).toBe('neural-damping');
  });

  it('refuses a psionic ability while Neural Damping is selected', () => {
    const reason = psionicAbilityBlockReason(NEURAL_DAMPING_BUILD, 0, 'low-left');

    expect(reason).toBe('neural-damping');
  });

  it('refuses a psionic ability of another psi level', () => {
    const reason = psionicAbilityBlockReason(EMPTY_BUILD, 0, 'high-left');

    expect(reason).toBe('not-offered');
  });

  it('refuses a psi level outside the psionic tree', () => {
    const reason = psionicAbilityBlockReason(EMPTY_BUILD, 2, null);

    expect(reason).toBe('not-offered');
  });
});

describe('officerPerkBlockReason', () => {
  it('allows an officer perk of the officer rank', () => {
    const reason = officerPerkBlockReason(1, 'beta-left');

    expect(reason).toBeNull();
  });

  it('allows clearing an officer rank', () => {
    const reason = officerPerkBlockReason(1, null);

    expect(reason).toBeNull();
  });

  it('refuses an officer perk of another officer rank', () => {
    const reason = officerPerkBlockReason(0, 'beta-left');

    expect(reason).toBe('not-offered');
  });

  it('refuses an officer rank outside the officer tree', () => {
    const reason = officerPerkBlockReason(2, null);

    expect(reason).toBe('not-offered');
  });
});
