import { describe, expect, it, vi } from 'vitest';

import {
  biosoldierBuildBranchSet,
  biosoldierBuildTraits,
  defaultBiosoldierBuild,
  defaultSoldierBuild,
  selectBiosoldierBuildGeneMod,
  selectBiosoldierBuildOfficerPerk,
  selectBiosoldierBuildPsionicAbility,
  selectSoldierBuildPerk,
} from '@entities/soldier/model/build';

import {
  ALL_OFFICER_PERKS,
  ALL_PERKS,
  ALL_PSIONICS,
  ALPHA_OFFICER_PERKS,
  BASE_PERKS,
  createBiosoldierBuildMock,
  createBuildMock,
  createOfficerBuildMock,
  FEET_GENE_MODS,
  GAMMA_OFFICER_PERKS,
  HIGH_PSIONICS,
  LOW_AND_MIDDLE_PSIONICS,
  NEURAL_DAMPING_GENE_MODS,
  NO_GENE_MODS,
  NO_OFFICER_PERKS,
  NO_PSIONICS,
  PERKS_TO_THIRD,
  SOLDIER_CLASS_MOCK,
} from './build.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./build.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./build.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/psi-level-content', async () => ({
  PSI_LEVEL_CONTENT: (await import('./build.mock')).PSI_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./build.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/officer-rank-content', async () => ({
  OFFICER_RANK_CONTENT: (await import('./build.mock')).OFFICER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('defaultSoldierBuild', () => {
  it('selects the base perk and leaves the other ranks empty', () => {
    const build = defaultSoldierBuild(SOLDIER_CLASS_MOCK);

    expect(build.perks).toEqual(BASE_PERKS);
  });
});

describe('defaultBiosoldierBuild', () => {
  it('leaves every psi level empty', () => {
    const build = defaultBiosoldierBuild(SOLDIER_CLASS_MOCK);

    expect(build.psionicAbilities).toEqual(NO_PSIONICS);
  });

  it('leaves every officer rank empty', () => {
    const build = defaultBiosoldierBuild(SOLDIER_CLASS_MOCK);

    expect(build.officerPerks).toEqual(NO_OFFICER_PERKS);
  });
});

describe('selectSoldierBuildPerk', () => {
  it('selects a perk on an empty rank', () => {
    const build = createBuildMock(BASE_PERKS);

    selectSoldierBuildPerk(build, 1, 'left');

    expect(build.perks).toEqual(['granted', 'left', null, null]);
  });

  it('selects a perk on a rank above empty ones', () => {
    const build = createBuildMock(BASE_PERKS);

    selectSoldierBuildPerk(build, 3, 'bottom');

    expect(build.perks).toEqual(['granted', null, null, 'bottom']);
  });

  it('replaces the selection on a completed rank and keeps higher ranks', () => {
    const build = createBuildMock(PERKS_TO_THIRD);

    selectSoldierBuildPerk(build, 1, 'left');

    expect(build.perks).toEqual(['granted', 'left', 'top', null]);
  });

  it('clears only the rank on a null perk', () => {
    const build = createBuildMock(ALL_PERKS);

    selectSoldierBuildPerk(build, 2, null);

    expect(build.perks).toEqual(['granted', 'right', null, 'bottom']);
  });

  it('leaves a rank granted with the class untouched', () => {
    const build = createBuildMock(PERKS_TO_THIRD);

    selectSoldierBuildPerk(build, 0, null);

    expect(build.perks).toEqual(PERKS_TO_THIRD);
  });

  it('ignores a perk of another rank of the class tree', () => {
    const build = createBuildMock(BASE_PERKS);

    selectSoldierBuildPerk(build, 1, 'top');

    expect(build.perks).toEqual(BASE_PERKS);
  });

  it('ignores a perk outside the class tree', () => {
    const build = createBuildMock(PERKS_TO_THIRD);

    selectSoldierBuildPerk(build, 1, 'missing');

    expect(build.perks).toEqual(PERKS_TO_THIRD);
  });

  it('ignores a rank above the class tree', () => {
    const build = createBuildMock(ALL_PERKS);

    selectSoldierBuildPerk(build, 4, 'bottom');

    expect(build.perks).toEqual(ALL_PERKS);
  });

  it('keeps the officer perks of a biosoldier build when a rank is cleared', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectSoldierBuildPerk(build, 1, null);

    expect(build.officerPerks).toEqual(ALL_OFFICER_PERKS);
  });
});

describe('selectBiosoldierBuildGeneMod', () => {
  it('selects a gene mod in an empty body part', () => {
    const build = createBiosoldierBuildMock([null, null]);

    selectBiosoldierBuildGeneMod(build, 1, 'feet-second');

    expect(build.geneMods).toEqual([null, 'feet-second']);
  });

  it('replaces the gene mod of a body part with the other one', () => {
    const build = createBiosoldierBuildMock(['neural-damping', null]);

    selectBiosoldierBuildGeneMod(build, 0, 'head-second');

    expect(build.geneMods).toEqual(['head-second', null]);
  });

  it('clears a body part on a null gene mod', () => {
    const build = createBiosoldierBuildMock(['neural-damping', 'feet-first']);

    selectBiosoldierBuildGeneMod(build, 0, null);

    expect(build.geneMods).toEqual([null, 'feet-first']);
  });

  it('keeps the gene mods of the other body parts', () => {
    const build = createBiosoldierBuildMock(['neural-damping', null]);

    selectBiosoldierBuildGeneMod(build, 1, 'feet-first');

    expect(build.geneMods).toEqual(['neural-damping', 'feet-first']);
  });

  it('ignores a gene mod of another body part', () => {
    const build = createBiosoldierBuildMock([null, null]);

    selectBiosoldierBuildGeneMod(build, 0, 'feet-first');

    expect(build.geneMods).toEqual([null, null]);
  });

  it('ignores a body part outside the build', () => {
    const build = createBiosoldierBuildMock([null, null]);

    selectBiosoldierBuildGeneMod(build, 2, null);

    expect(build.geneMods).toEqual([null, null]);
  });

  it('ignores Neural Damping while a psionic ability is selected above empty psi levels', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, HIGH_PSIONICS);

    selectBiosoldierBuildGeneMod(build, 0, 'neural-damping');

    expect(build.geneMods).toEqual([null, null]);
  });

  it('ignores Neural Damping while a psionic ability is selected', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, LOW_AND_MIDDLE_PSIONICS);

    selectBiosoldierBuildGeneMod(build, 0, 'neural-damping');

    expect(build.geneMods).toEqual([null, null]);
  });
});

describe('selectBiosoldierBuildPsionicAbility', () => {
  it('selects a psionic ability on an empty psi level', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'low-right');

    expect(build.psionicAbilities).toEqual(['low-right', null, null]);
  });

  it('selects a psionic ability on a psi level above empty ones', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS);

    selectBiosoldierBuildPsionicAbility(build, 2, 'high-left');

    expect(build.psionicAbilities).toEqual([null, null, 'high-left']);
  });

  it('replaces the psionic ability of a completed psi level and keeps the levels above', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, ALL_PSIONICS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'low-right');

    expect(build.psionicAbilities).toEqual(['low-right', 'middle', 'high-right']);
  });

  it('clears only the psi level on a null ability', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, ALL_PSIONICS);

    selectBiosoldierBuildPsionicAbility(build, 1, null);

    expect(build.psionicAbilities).toEqual(['low-left', null, 'high-right']);
  });

  it('ignores a psionic ability of another psi level', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'middle');

    expect(build.psionicAbilities).toEqual(NO_PSIONICS);
  });

  it('ignores any psionic ability while Neural Damping is selected', () => {
    const build = createBiosoldierBuildMock(NEURAL_DAMPING_GENE_MODS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'low-left');

    expect(build.psionicAbilities).toEqual(NO_PSIONICS);
  });
});

describe('selectBiosoldierBuildOfficerPerk', () => {
  it('selects an officer perk on an empty officer rank', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD);

    selectBiosoldierBuildOfficerPerk(build, 0, 'alpha-right');

    expect(build.officerPerks).toEqual(['alpha-right', null, null]);
  });

  it('selects an officer perk on an officer rank above empty ones', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD);

    selectBiosoldierBuildOfficerPerk(build, 2, 'gamma-left');

    expect(build.officerPerks).toEqual([null, null, 'gamma-left']);
  });

  it('selects an officer perk with only the base perk selected', () => {
    const build = createOfficerBuildMock(BASE_PERKS);

    selectBiosoldierBuildOfficerPerk(build, 1, 'beta-right');

    expect(build.officerPerks).toEqual([null, 'beta-right', null]);
  });

  it('replaces the officer perk of a completed officer rank and keeps the officer ranks above', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildOfficerPerk(build, 0, 'alpha-right');

    expect(build.officerPerks).toEqual(['alpha-right', 'beta-left', 'gamma-right']);
  });

  it('clears only the officer rank on a null perk', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildOfficerPerk(build, 1, null);

    expect(build.officerPerks).toEqual(['alpha-left', null, 'gamma-right']);
  });

  it('ignores an officer perk of another officer rank', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD);

    selectBiosoldierBuildOfficerPerk(build, 0, 'beta-left');

    expect(build.officerPerks).toEqual(NO_OFFICER_PERKS);
  });
});

describe('biosoldierBuildBranchSet', () => {
  it('gives plain for a build without gene mods and psionic abilities', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS);

    const branchSet = biosoldierBuildBranchSet(build);

    expect(branchSet).toBe('plain');
  });

  it('gives gene mods for a build with a gene mod', () => {
    const build = createBiosoldierBuildMock(FEET_GENE_MODS);

    const branchSet = biosoldierBuildBranchSet(build);

    expect(branchSet).toBe('gene-mods');
  });

  it('gives gene mods for a build with only Neural Damping', () => {
    const build = createBiosoldierBuildMock(NEURAL_DAMPING_GENE_MODS);

    const branchSet = biosoldierBuildBranchSet(build);

    expect(branchSet).toBe('gene-mods');
  });

  it('gives psionic for a build with a psionic ability above empty psi levels', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, HIGH_PSIONICS);

    const branchSet = biosoldierBuildBranchSet(build);

    expect(branchSet).toBe('psionic');
  });

  it('gives psionic for a build with psionic abilities', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, LOW_AND_MIDDLE_PSIONICS);

    const branchSet = biosoldierBuildBranchSet(build);

    expect(branchSet).toBe('psionic');
  });

  it('gives both for a build with gene mods and psionic abilities', () => {
    const build = createBiosoldierBuildMock(FEET_GENE_MODS, LOW_AND_MIDDLE_PSIONICS);

    const branchSet = biosoldierBuildBranchSet(build);

    expect(branchSet).toBe('both');
  });
});

describe('biosoldierBuildTraits', () => {
  it('has no traits for an empty build', () => {
    const build = createOfficerBuildMock(BASE_PERKS);

    const traits = biosoldierBuildTraits(build);

    expect(traits).toEqual({ hasGeneMod: false, hasPsionicAbility: false, isOfficer: false });
  });

  it('has a gene mod for a build with only Neural Damping', () => {
    const build = createBiosoldierBuildMock(NEURAL_DAMPING_GENE_MODS);

    const traits = biosoldierBuildTraits(build);

    expect(traits).toEqual({ hasGeneMod: true, hasPsionicAbility: false, isOfficer: false });
  });

  it('has a psionic ability for a build with a psionic ability above empty psi levels', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, HIGH_PSIONICS);

    const traits = biosoldierBuildTraits(build);

    expect(traits).toEqual({ hasGeneMod: false, hasPsionicAbility: true, isOfficer: false });
  });

  it('is not an officer for a build with every rank perk but no officer perk', () => {
    const build = createOfficerBuildMock(ALL_PERKS);

    const traits = biosoldierBuildTraits(build);

    expect(traits).toEqual({ hasGeneMod: false, hasPsionicAbility: false, isOfficer: false });
  });

  it('is an officer for a build with an officer perk on the first officer rank', () => {
    const build = createOfficerBuildMock(ALL_PERKS, ALPHA_OFFICER_PERKS);

    const traits = biosoldierBuildTraits(build);

    expect(traits).toEqual({ hasGeneMod: false, hasPsionicAbility: false, isOfficer: true });
  });

  it('is an officer for a build with an officer perk above empty officer ranks', () => {
    const build = createOfficerBuildMock(BASE_PERKS, GAMMA_OFFICER_PERKS);

    const traits = biosoldierBuildTraits(build);

    expect(traits).toEqual({ hasGeneMod: false, hasPsionicAbility: false, isOfficer: true });
  });
});
