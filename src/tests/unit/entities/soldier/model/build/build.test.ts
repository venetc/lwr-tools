import { describe, expect, it, vi } from 'vitest';

import { biosoldierBuildBranchSet, selectBiosoldierBuildGeneMod, selectBiosoldierBuildPsionicAbility, selectSoldierBuildPerk } from '@entities/soldier/model/build';

import {
  ALL_PSIONICS,
  BASE_PERKS,
  createBiosoldierBuildMock,
  createBuildMock,
  FEET_GENE_MODS,
  FULL_PERKS,
  LOW_AND_MIDDLE_PSIONICS,
  NEURAL_DAMPING_GENE_MODS,
  NO_GENE_MODS,
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

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('selectSoldierBuildPerk', () => {
  it('selects a perk on the available rank', () => {
    const build = createBuildMock(BASE_PERKS);

    selectSoldierBuildPerk(build, 1, 'left');

    expect(build.perks).toEqual(['granted', 'left']);
  });

  it('replaces the selection on a completed rank and keeps higher ranks', () => {
    const build = createBuildMock(FULL_PERKS);

    selectSoldierBuildPerk(build, 1, 'left');

    expect(build.perks).toEqual(['granted', 'left', 'top']);
  });

  it('clears the rank and all higher ranks on a null perk', () => {
    const build = createBuildMock(FULL_PERKS);

    selectSoldierBuildPerk(build, 1, null);

    expect(build.perks).toEqual(['granted']);
  });

  it('leaves a rank granted with the class untouched', () => {
    const build = createBuildMock(FULL_PERKS);

    selectSoldierBuildPerk(build, 0, null);

    expect(build.perks).toEqual(FULL_PERKS);
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
