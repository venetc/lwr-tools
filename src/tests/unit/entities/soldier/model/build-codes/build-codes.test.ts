import { describe, expect, it, vi } from 'vitest';

import { biosoldierBuildCodes, biosoldierBuildFromCodes, mecBuildCodes, mecBuildFromCodes } from '@entities/soldier/model/build-codes';

import {
  BIOSOLDIER_CLASS_MEC_BUILD,
  BIOSOLDIER_CLASS_MEC_CODES,
  BLANK_NAME_BUILD,
  BLANK_NAME_CODES,
  createBuildMock,
  createCodesMock,
  createSignatureSkillBuildMock,
  FEET_GENE_MOD_BUILD,
  FEET_GENE_MOD_CODES,
  GAPPED_BUILD,
  GAPPED_CODES,
  LONG_PERK_CODES,
  LOW_PSIONIC_CODES,
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
  NEURAL_DAMPING_ONLY_CODES,
  NOT_CLASS_TREE_SIGNATURE_SKILL_CODES,
  OTHER_RANK_MEC_BUILD,
  OTHER_RANK_PERK_BUILD,
  OTHER_RANK_PERK_CODES,
  OTHER_RANK_PERK_OUTDATED,
  OUT_OF_TREE_VARIANT_PERK_CODES,
  OUTDATED_BRANCH_CASES,
  PLAIN_BUILD,
  ROOKIE_OFFICER_BUILD,
  ROOKIE_OFFICER_CODES,
  SHORT_GENE_MOD_CODES,
  SHORT_PERK_CODES,
  SUPER_SOLDIER_BUILD,
  SUPER_SOLDIER_CODES,
  SWAPPED_PERK_CODES,
  TOP_SIGNATURE_SKILL_MEC_BUILD,
  UNKNOWN_ABILITY_PERK_CODES,
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

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {}, OFFICER_RANK_MEDAL_PLACEHOLDER: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('biosoldierBuildCodes', () => {
  it('gives the codes of a build with every part', () => {
    const codes = biosoldierBuildCodes(SUPER_SOLDIER_BUILD);

    expect(codes).toEqual(SUPER_SOLDIER_CODES);
  });

  it('gives the codes of a build with empty steps', () => {
    const codes = biosoldierBuildCodes(GAPPED_BUILD);

    expect(codes).toEqual(GAPPED_CODES);
  });

  it('gives the codes of a build with an officer perk and only the base perk', () => {
    const codes = biosoldierBuildCodes(ROOKIE_OFFICER_BUILD);

    expect(codes).toEqual(ROOKIE_OFFICER_CODES);
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

  it('gives empty body parts as empty steps', () => {
    const codes = biosoldierBuildCodes(FEET_GENE_MOD_BUILD);

    expect(codes).toEqual(FEET_GENE_MOD_CODES);
  });

  it('gives null for a MEC class', () => {
    const codes = biosoldierBuildCodes(MEC_CLASS_BIOSOLDIER_BUILD);

    expect(codes).toBeNull();
  });

  it('gives null for an unknown perk', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'missing', null] }));

    expect(codes).toBeNull();
  });

  it('gives null for a perk of another rank', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'top', null] }));

    expect(codes).toBeNull();
  });

  it('gives null for more perks than ranks', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'right', 'top', 'top'] }));

    expect(codes).toBeNull();
  });

  it('gives null for fewer ranks than the class tree has', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['granted', 'right'] }));

    expect(codes).toBeNull();
  });

  it('gives null for a first rank without the base perk', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ perks: ['left', 'right', null] }));

    expect(codes).toBeNull();
  });

  it('gives null for a gene mod outside its body part', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ geneMods: ['feet-first', null] }));

    expect(codes).toBeNull();
  });

  it('gives null for a psionic ability outside its psi level', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ psionicAbilities: ['high', null] }));

    expect(codes).toBeNull();
  });

  it('gives null for Neural Damping with psionic abilities', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ geneMods: ['neural-damping', null], psionicAbilities: [null, 'high'] }));

    expect(codes).toBeNull();
  });

  it('gives null for an officer perk outside its officer rank', () => {
    const codes = biosoldierBuildCodes(createBuildMock({ officerPerks: ['beta-left', null] }));

    expect(codes).toBeNull();
  });
});

describe('biosoldierBuildCodes of a Signature skill', () => {
  it('gives the code of a perk not selected in the build', () => {
    const build = createSignatureSkillBuildMock('left');

    const codes = biosoldierBuildCodes(build);

    expect(codes?.signatureSkill).toBe(11);
  });

  it('gives the code of the Base perk', () => {
    const build = createSignatureSkillBuildMock('granted');

    const codes = biosoldierBuildCodes(build);

    expect(codes?.signatureSkill).toBe(10);
  });

  it('gives no code without a Signature skill', () => {
    const codes = biosoldierBuildCodes(PLAIN_BUILD);

    expect(codes?.signatureSkill).toBeNull();
  });

  it('gives null for a perk not in the class tree', () => {
    const build = createSignatureSkillBuildMock('foreign');

    const codes = biosoldierBuildCodes(build);

    expect(codes).toBeNull();
  });
});

describe('biosoldierBuildFromCodes', () => {
  it('restores a build with every part', () => {
    const build = biosoldierBuildFromCodes(SUPER_SOLDIER_CODES);

    expect(build).toEqual({ build: SUPER_SOLDIER_BUILD, outdated: [] });
  });

  it('restores a build with empty steps', () => {
    const build = biosoldierBuildFromCodes(GAPPED_CODES);

    expect(build).toEqual({ build: GAPPED_BUILD, outdated: [] });
  });

  it('restores an officer perk with only the base perk', () => {
    const build = biosoldierBuildFromCodes(ROOKIE_OFFICER_CODES);

    expect(build).toEqual({ build: ROOKIE_OFFICER_BUILD, outdated: [] });
  });

  it('restores a build with its own name and empty branches', () => {
    const build = biosoldierBuildFromCodes(NAMED_CODES);

    expect(build).toEqual({ build: NAMED_BUILD, outdated: [] });
  });

  it('names a build with a blank name after its class', () => {
    const build = biosoldierBuildFromCodes(BLANK_NAME_CODES);

    expect(build?.build.name).toBe('Tester');
  });

  it('places each gene mod in its body part', () => {
    const build = biosoldierBuildFromCodes(FEET_GENE_MOD_CODES);

    expect(build).toEqual({ build: FEET_GENE_MOD_BUILD, outdated: [] });
  });

  it('restores Neural Damping without psionic abilities', () => {
    const build = biosoldierBuildFromCodes(NEURAL_DAMPING_CODES);

    expect(build).toEqual({ build: NEURAL_DAMPING_BUILD, outdated: [] });
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
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: UNKNOWN_ABILITY_PERK_CODES }));

    expect(build).toBeNull();
  });

  it('leaves a perk of another rank out as an Outdated selection', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: OTHER_RANK_PERK_CODES }));

    expect(build).toEqual({ build: OTHER_RANK_PERK_BUILD, outdated: OTHER_RANK_PERK_OUTDATED });
  });

  it('takes a perk of its rank under another variant index', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: SWAPPED_PERK_CODES }));

    expect(build).toEqual({ build: PLAIN_BUILD, outdated: [] });
  });

  it.each(OUTDATED_BRANCH_CASES)('leaves %s out as an Outdated selection', (_, codes, outdated) => {
    const build = biosoldierBuildFromCodes(createCodesMock(codes));

    expect(build).toEqual({ build: PLAIN_BUILD, outdated });
  });

  it('gives null for a variant index outside the rank', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: OUT_OF_TREE_VARIANT_PERK_CODES }));

    expect(build).toBeNull();
  });

  it('gives null for fewer ranks than the class tree has', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: SHORT_PERK_CODES }));

    expect(build).toBeNull();
  });

  it('gives null for more ranks than the class tree has', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ perks: LONG_PERK_CODES }));

    expect(build).toBeNull();
  });

  it('gives null for fewer body parts than the build has', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ geneMods: SHORT_GENE_MOD_CODES }));

    expect(build).toBeNull();
  });

  it('gives null for Neural Damping with psionic abilities', () => {
    const build = biosoldierBuildFromCodes(createCodesMock({ geneMods: NEURAL_DAMPING_ONLY_CODES, psionicAbilities: LOW_PSIONIC_CODES }));

    expect(build).toBeNull();
  });
});

describe('biosoldierBuildFromCodes of a Signature skill', () => {
  it('restores a perk not selected in the build', () => {
    const result = biosoldierBuildFromCodes(createCodesMock({ signatureSkill: 11 }));

    expect(result?.build.signatureSkill).toBe('left');
  });

  it('restores the Base perk', () => {
    const result = biosoldierBuildFromCodes(createCodesMock({ signatureSkill: 10 }));

    expect(result?.build.signatureSkill).toBe('granted');
  });

  it('keeps a perk the code has on another rank', () => {
    const result = biosoldierBuildFromCodes(createCodesMock({ perks: OTHER_RANK_PERK_CODES, signatureSkill: 13 }));

    expect(result?.build.signatureSkill).toBe('top');
  });

  it.each(NOT_CLASS_TREE_SIGNATURE_SKILL_CODES)('leaves the Signature skill empty for %s', (_, code) => {
    const result = biosoldierBuildFromCodes(createCodesMock({ signatureSkill: code }));

    expect(result?.build.signatureSkill).toBeNull();
  });

  it.each(NOT_CLASS_TREE_SIGNATURE_SKILL_CODES)('gives no Outdated selection for %s', (_, code) => {
    const result = biosoldierBuildFromCodes(createCodesMock({ signatureSkill: code }));

    expect(result?.outdated).toEqual([]);
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
    const codes = mecBuildCodes({ ...MEC_BUILD, perks: ['granted', 'top', null] });

    expect(codes).toBeNull();
  });
});

describe('mecBuildCodes of a Signature skill', () => {
  it('gives the code of the Signature skill', () => {
    const codes = mecBuildCodes(TOP_SIGNATURE_SKILL_MEC_BUILD);

    expect(codes?.signatureSkill).toBe(13);
  });
});

describe('mecBuildFromCodes of a Signature skill', () => {
  it('restores the Signature skill', () => {
    const result = mecBuildFromCodes({ ...MEC_CODES, signatureSkill: 13 });

    expect(result?.build.signatureSkill).toBe('top');
  });

  it('leaves the Signature skill empty for a perk not in the class tree', () => {
    const result = mecBuildFromCodes({ ...MEC_CODES, signatureSkill: 14 });

    expect(result?.build.signatureSkill).toBeNull();
  });
});

describe('mecBuildFromCodes', () => {
  it('restores a build with the default name', () => {
    const build = mecBuildFromCodes(MEC_CODES);

    expect(build).toEqual({ build: MEC_BUILD, outdated: [] });
  });

  it('restores a build with its own name', () => {
    const build = mecBuildFromCodes(NAMED_MEC_CODES);

    expect(build).toEqual({ build: NAMED_MEC_BUILD, outdated: [] });
  });

  it('gives null for a biosoldier class', () => {
    const build = mecBuildFromCodes(BIOSOLDIER_CLASS_MEC_CODES);

    expect(build).toBeNull();
  });

  it('leaves a perk of another rank out as an Outdated selection', () => {
    const build = mecBuildFromCodes({ ...MEC_CODES, perks: OTHER_RANK_PERK_CODES });

    expect(build).toEqual({ build: OTHER_RANK_MEC_BUILD, outdated: OTHER_RANK_PERK_OUTDATED });
  });
});
