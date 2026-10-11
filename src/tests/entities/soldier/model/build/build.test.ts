import { describe, expect, it, vi } from 'vitest';

import { selectSoldierBuildPerk } from '@entities/soldier/model/build';

import { BASE_PERKS, createBuildMock, FULL_PERKS } from './build.mock';

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
