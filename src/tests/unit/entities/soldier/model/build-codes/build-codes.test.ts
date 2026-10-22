import { describe, expect, it, vi } from 'vitest';

import { biosoldierBuildCodes, biosoldierBuildFromCodes, mecBuildCodes, mecBuildFromCodes } from '@entities/soldier/model/build-codes';

import {
  BIOSOLDIER_CLASS_MEC_BUILD,
  BIOSOLDIER_CLASS_MEC_CODES,
  BLANK_NAME_BUILD,
  BLANK_NAME_CODES,
  createBuildMock,
  createCodesMock,
  FEET_GENE_MOD_BUILD,
  FEET_GENE_MOD_CODES,
  MEC_BUILD,
  MEC_CLASS_BIOSOLDIER_BUILD,
  MEC_CLASS_BIOSOLDIER_CODES,
  MEC_CODES,
  NAMED_BUILD,
  NAMED_CODES,
  NAMED_MEC_BUILD,
  NAMED_MEC_CODES,
  NEURAL_DAMPING_BUILD,
  NEURAL_DAMPING_CODES,
  SUPER_SOLDIER_BUILD,
  SUPER_SOLDIER_CODES,
  UNKNOWN_ABILITY_CODE,
  UNKNOWN_CLASS_CODE,
} from './build-codes.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./build-codes.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./build-codes.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/psi-level-content', async () => ({
  PSI_LEVEL_CONTENT: (await import('./build-codes.mock')).PSI_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/officer-rank-content', async () => ({
  OFFICER_RANK_CONTENT: (await import('./build-codes.mock')).OFFICER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./build-codes.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/biosoldier-class-content', async () => ({
  BIOSOLDIER_CLASS_CONTENT: (await import('./build-codes.mock')).BIOSOLDIER_CLASS_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/mec-class-content', async () => ({
  MEC_CLASS_CONTENT: (await import('./build-codes.mock')).MEC_CLASS_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/biosoldier-class-icons', () => ({ BIOSOLDIER_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/mec-class-icons', () => ({ MEC_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('biosoldierBuildCodes', () => {
  it('gives the codes of a build with every part', () => {
    const codes = biosoldierBuildCodes(SUPER_SOLDIER_BUILD);

    expect(codes).toEqual(SUPER_SOLDIER_CODES);
  });

  it('gives the name of a build with its own name', () => {
    const codes = biosoldierBuildCodes(NAMED_BUILD);

    expect(codes).toEqual(NAMED_CODES);
  });

  it('gives no name for a blank name', () => {
    const codes = biosoldierBuildCodes(BLANK_NAME_BUILD);

    expect(codes?.name).toBeNull();
  });

  it('leaves the base perk out of the perk codes', () => {
    const codes = biosoldierBuildCodes(SUPER_SOLDIER_BUILD);

    expect(codes?.perks).toEqual(SUPER_SOLDIER_CODES.perks);
  });

  it('leaves empty body parts out of the gene mod codes', () => {
    const codes = biosoldierBuildCodes(FEET_GENE_MOD_BUILD);

    expect(codes).toEqual(FEET_GENE_MOD_CODES);
  });

  it('gives null for a MEC class', () => {
    const codes = biosoldierBuildCodes(MEC_CLASS_BIOSOLDIER_BUILD);

    expect(codes).toBeNull();
  });

  it('gives null for an unknown perk', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'missing'] }));

    expect(codes).toBeNull();
  });

  it('gives null for a perk of another rank', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'top'] }));

    expect(codes).toBeNull();
  });

  it('gives null for more perks than ranks', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'right', 'top', 'top'] }));

    expect(codes).toBeNull();
  });

  it('gives null for a first rank without the base perk', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['left', 'right'] }));

    expect(codes).toBeNull();
  });

  it('gives null for a gene mod outside its body part', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ geneMods: ['feet-first', null] }));

    expect(codes).toBeNull();
  });

  it('gives null for a psionic ability outside its psi level', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ psionicAbilities: ['high'] }));

    expect(codes).toBeNull();
  });

  it('gives null for Neural Damping with psionic abilities', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ geneMods: ['neural-damping', null], psionicAbilities: ['low-left'] }));

    expect(codes).toBeNull();
  });

  it('gives null for an officer perk outside its officer rank', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ officerPerks: ['beta-left'] }));

    expect(codes).toBeNull();
  });

  it('gives null for an officer rank whose required rank is not completed', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'right'], officerPerks: ['alpha-left', 'beta-left'] }));

    expect(codes).toBeNull();
  });
});

describe('biosoldierBuildFromCodes', () => {
  it('restores a build with every part', () => {
    const build = biosoldierBuildFromCodes(SUPER_SOLDIER_CODES);

    expect(build).toEqual(SUPER_SOLDIER_BUILD);
  });

  it('restores a build with its own name', () => {
    const build = biosoldierBuildFromCodes(NAMED_CODES);

    expect(build).toEqual(NAMED_BUILD);
  });

  it('names a build with a blank name after its class', () => {
    const build = biosoldierBuildFromCodes(BLANK_NAME_CODES);

    expect(build?.name).toBe('Tester');
  });

  it('places each gene mod in its body part', () => {
    const build = biosoldierBuildFromCodes(FEET_GENE_MOD_CODES);

    expect(build).toEqual(FEET_GENE_MOD_BUILD);
  });

  it('restores Neural Damping without psionic abilities', () => {
    const build = biosoldierBuildFromCodes(NEURAL_DAMPING_CODES);

    expect(build).toEqual(NEURAL_DAMPING_BUILD);
  });

  it('gives null for an unknown class', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ classCode: UNKNOWN_CLASS_CODE }));

    expect(build).toBeNull();
  });

  it('gives null for a MEC class', () => {
    const build = biosoldierBuildFromCodes(MEC_CLASS_BIOSOLDIER_CODES);

    expect(build).toBeNull();
  });

  it('gives null for an unknown ability', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: [UNKNOWN_ABILITY_CODE] }));

    expect(build).toBeNull();
  });

  it('gives null for a perk of another rank', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: [13] }));

    expect(build).toBeNull();
  });

  it('gives null for more perks than ranks', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: [11, 13, 13] }));

    expect(build).toBeNull();
  });

  it('gives null for two gene mods of one body part', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ geneMods: [20, 21] }));

    expect(build).toBeNull();
  });

  it('gives null for gene mods out of body part order', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ geneMods: [22, 20] }));

    expect(build).toBeNull();
  });

  it('gives null for a gene mod code of another ability', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ geneMods: [12] }));

    expect(build).toBeNull();
  });

  it('gives null for a psionic ability outside its psi level', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ psionicAbilities: [32] }));

    expect(build).toBeNull();
  });

  it('gives null for Neural Damping with psionic abilities', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ geneMods: [20], psionicAbilities: [30] }));

    expect(build).toBeNull();
  });

  it('gives null for an officer perk outside its officer rank', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ officerPerks: [42] }));

    expect(build).toBeNull();
  });

  it('gives null for an officer rank whose required rank is not completed', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: [12], officerPerks: [40, 42] }));

    expect(build).toBeNull();
  });
});

describe('mecBuildCodes', () => {
  it('gives the codes of a build with the default name', () => {
    const codes = mecBuildCodes(MEC_BUILD);

    expect(codes).toEqual(MEC_CODES);
  });

  it('gives the name of a build with its own name', () => {
    const codes = mecBuildCodes(NAMED_MEC_BUILD);

    expect(codes).toEqual(NAMED_MEC_CODES);
  });

  it('gives null for a biosoldier class', () => {
    const codes = mecBuildCodes(BIOSOLDIER_CLASS_MEC_BUILD);

    expect(codes).toBeNull();
  });

  it('gives null for a perk of another rank', () => {
    const codes = mecBuildCodes({ ...MEC_BUILD, perks: ['granted', 'top'] });

    expect(codes).toBeNull();
  });
});

describe('mecBuildFromCodes', () => {
  it('restores a build with the default name', () => {
    const build = mecBuildFromCodes(MEC_CODES);

    expect(build).toEqual(MEC_BUILD);
  });

  it('restores a build with its own name', () => {
    const build = mecBuildFromCodes(NAMED_MEC_CODES);

    expect(build).toEqual(NAMED_MEC_BUILD);
  });

  it('gives null for a biosoldier class', () => {
    const build = mecBuildFromCodes(BIOSOLDIER_CLASS_MEC_CODES);

    expect(build).toBeNull();
  });

  it('gives null for a perk of another rank', () => {
    const build = mecBuildFromCodes({ ...MEC_CODES, perks: [13] });

    expect(build).toBeNull();
  });
});
