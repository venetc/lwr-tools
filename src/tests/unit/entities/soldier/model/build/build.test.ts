import { describe, expect, it, vi } from 'vitest';

import {
  biosoldierBuildBranchSet,
  isOfficerBuild,
  selectBiosoldierBuildGeneMod,
  selectBiosoldierBuildOfficerPerk,
  selectBiosoldierBuildPerk,
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
  LOW_AND_MIDDLE_PSIONICS,
  NEURAL_DAMPING_GENE_MODS,
  NO_GENE_MODS,
  PERKS_TO_THIRD,
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

describe('selectSoldierBuildPerk', () => {
  it('selects a perk on the available rank', () => {
    const build = createBuildMock(BASE_PERKS);

    selectSoldierBuildPerk(build, 1, 'left');

    expect(build.perks).toEqual(['granted', 'left']);
  });

  it('replaces the selection on a completed rank and keeps higher ranks', () => {
    const build = createBuildMock(PERKS_TO_THIRD);

    selectSoldierBuildPerk(build, 1, 'left');

    expect(build.perks).toEqual(['granted', 'left', 'top']);
  });

  it('clears the rank and all higher ranks on a null perk', () => {
    const build = createBuildMock(PERKS_TO_THIRD);

    selectSoldierBuildPerk(build, 1, null);

    expect(build.perks).toEqual(['granted']);
  });

  it('leaves a rank granted with the class untouched', () => {
    const build = createBuildMock(PERKS_TO_THIRD);

    selectSoldierBuildPerk(build, 0, null);

    expect(build.perks).toEqual(PERKS_TO_THIRD);
  });

  it('leaves a rank after the available one untouched', () => {
    const build = createBuildMock(BASE_PERKS);

    selectSoldierBuildPerk(build, 2, 'top');

    expect(build.perks).toEqual(BASE_PERKS);
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

  it('ignores Neural Damping while a psionic ability is selected', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, LOW_AND_MIDDLE_PSIONICS);

    selectBiosoldierBuildGeneMod(build, 0, 'neural-damping');

    expect(build.geneMods).toEqual([null, null]);
  });
});

describe('selectBiosoldierBuildPsionicAbility', () => {
  it('selects a psionic ability on the first psi level', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'low-right');

    expect(build.psionicAbilities).toEqual(['low-right']);
  });

  it('selects a psionic ability on the next open psi level', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, LOW_AND_MIDDLE_PSIONICS);

    selectBiosoldierBuildPsionicAbility(build, 2, 'high-left');

    expect(build.psionicAbilities).toEqual(['low-left', 'middle', 'high-left']);
  });

  it('replaces the psionic ability of a completed psi level and keeps the levels above', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, ALL_PSIONICS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'low-right');

    expect(build.psionicAbilities).toEqual(['low-right', 'middle', 'high-right']);
  });

  it('clears the psi level and all levels above on a null ability', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, ALL_PSIONICS);

    selectBiosoldierBuildPsionicAbility(build, 1, null);

    expect(build.psionicAbilities).toEqual(['low-left']);
  });

  it('ignores a psi level beyond the next open one', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS, ['low-left']);

    selectBiosoldierBuildPsionicAbility(build, 2, 'high-left');

    expect(build.psionicAbilities).toEqual(['low-left']);
  });

  it('ignores a psionic ability of another psi level', () => {
    const build = createBiosoldierBuildMock(NO_GENE_MODS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'middle');

    expect(build.psionicAbilities).toEqual([]);
  });

  it('ignores any psionic ability while Neural Damping is selected', () => {
    const build = createBiosoldierBuildMock(NEURAL_DAMPING_GENE_MODS);

    selectBiosoldierBuildPsionicAbility(build, 0, 'low-left');

    expect(build.psionicAbilities).toEqual([]);
  });
});

describe('selectBiosoldierBuildOfficerPerk', () => {
  it('selects an officer perk on the open officer rank', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD);

    selectBiosoldierBuildOfficerPerk(build, 0, 'alpha-right');

    expect(build.officerPerks).toEqual(['alpha-right']);
  });

  it('replaces the officer perk of a completed officer rank and keeps the officer ranks above', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildOfficerPerk(build, 0, 'alpha-right');

    expect(build.officerPerks).toEqual(['alpha-right', 'beta-left', 'gamma-right']);
  });

  it('clears the officer rank and all officer ranks above on a null perk', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildOfficerPerk(build, 1, null);

    expect(build.officerPerks).toEqual(['alpha-left']);
  });

  it('ignores an officer rank beyond the next open one', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALPHA_OFFICER_PERKS);

    selectBiosoldierBuildOfficerPerk(build, 2, 'gamma-left');

    expect(build.officerPerks).toEqual(['alpha-left']);
  });

  it('ignores an officer rank whose required rank is not completed', () => {
    const build = createOfficerBuildMock(BASE_PERKS);

    selectBiosoldierBuildOfficerPerk(build, 0, 'alpha-left');

    expect(build.officerPerks).toEqual([]);
  });

  it('ignores an officer perk of another officer rank', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD);

    selectBiosoldierBuildOfficerPerk(build, 0, 'beta-left');

    expect(build.officerPerks).toEqual([]);
  });
});

describe('selectBiosoldierBuildPerk', () => {
  it('clears officer perks from the first officer rank whose required rank is cleared', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildPerk(build, 2, null);

    expect(build.officerPerks).toEqual(['alpha-left']);
  });

  it('clears all officer perks when the required rank of the first officer rank is cleared', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildPerk(build, 1, null);

    expect(build.officerPerks).toEqual([]);
  });

  it('keeps officer perks when a perk on a completed rank is replaced', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildPerk(build, 1, 'left');

    expect(build.officerPerks).toEqual(['alpha-left', 'beta-left', 'gamma-right']);
  });

  it('keeps officer perks when a rank above every required rank is cleared', () => {
    const build = createOfficerBuildMock(ALL_PERKS, ALL_OFFICER_PERKS);

    selectBiosoldierBuildPerk(build, 3, null);

    expect(build.officerPerks).toEqual(['alpha-left', 'beta-left', 'gamma-right']);
  });

  it('clears the rank and all higher ranks like a soldier build', () => {
    const build = createOfficerBuildMock(PERKS_TO_THIRD, ALL_OFFICER_PERKS);

    selectBiosoldierBuildPerk(build, 2, null);

    expect(build.perks).toEqual(['granted', 'right']);
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

describe('isOfficerBuild', () => {
  it('is false for a build without officer perks', () => {
    const build = createOfficerBuildMock(ALL_PERKS);

    const isOfficer = isOfficerBuild(build);

    expect(isOfficer).toBe(false);
  });

  it('is true for a build with an officer perk', () => {
    const build = createOfficerBuildMock(ALL_PERKS, ALPHA_OFFICER_PERKS);

    const isOfficer = isOfficerBuild(build);

    expect(isOfficer).toBe(true);
  });
});
