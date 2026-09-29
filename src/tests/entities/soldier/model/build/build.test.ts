import { describe, expect, it, vi } from 'vitest';

import { selectSoldierBuildTalent } from '@entities/soldier/model/build';

import { BASE_TALENTS, createBuildMock, FULL_TALENTS } from './build.mock';

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./build.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('selectSoldierBuildTalent', () => {
  it('selects a talent on the available rank', () => {
    const build = createBuildMock(BASE_TALENTS);

    selectSoldierBuildTalent(build, 1, 'left');

    expect(build.talents).toEqual(['granted', 'left']);
  });

  it('replaces the selection on a completed rank and keeps higher ranks', () => {
    const build = createBuildMock(FULL_TALENTS);

    selectSoldierBuildTalent(build, 1, 'left');

    expect(build.talents).toEqual(['granted', 'left', 'top']);
  });

  it('clears the rank and all higher ranks on a null talent', () => {
    const build = createBuildMock(FULL_TALENTS);

    selectSoldierBuildTalent(build, 1, null);

    expect(build.talents).toEqual(['granted']);
  });

  it('leaves a rank granted with the class untouched', () => {
    const build = createBuildMock(FULL_TALENTS);

    selectSoldierBuildTalent(build, 0, null);

    expect(build.talents).toEqual(FULL_TALENTS);
  });

  it('leaves a rank after the available one untouched', () => {
    const build = createBuildMock(BASE_TALENTS);

    selectSoldierBuildTalent(build, 2, 'top');

    expect(build.talents).toEqual(BASE_TALENTS);
  });
});
