import { describe, expect, it, vi } from 'vitest';

import { selectBiosoldierBuildGeneMod, selectSoldierBuildPerk } from '@entities/soldier/model/build';

import { BASE_PERKS, createBiosoldierBuildMock, createBuildMock, FULL_PERKS } from './build.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./build.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./build.mock')).BODY_PART_CONTENT_MOCK,
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
    const build = createBiosoldierBuildMock(['head-first', null]);

    selectBiosoldierBuildGeneMod(build, 0, 'head-second');

    expect(build.geneMods).toEqual(['head-second', null]);
  });

  it('clears a body part on a null gene mod', () => {
    const build = createBiosoldierBuildMock(['head-first', 'feet-first']);

    selectBiosoldierBuildGeneMod(build, 0, null);

    expect(build.geneMods).toEqual([null, 'feet-first']);
  });

  it('keeps the gene mods of the other body parts', () => {
    const build = createBiosoldierBuildMock(['head-first', null]);

    selectBiosoldierBuildGeneMod(build, 1, 'feet-first');

    expect(build.geneMods).toEqual(['head-first', 'feet-first']);
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
});
