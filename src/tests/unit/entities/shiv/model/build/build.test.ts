import { describe, expect, it, vi } from 'vitest';

import { selectShivBuildPerk } from '@entities/shiv/model/build';

import { createBuildMock, EMPTY_PERKS, FILLED_PERKS } from './build.mock';

vi.mock('@entities/shiv/config/constants/perk-content', async () => ({
  SHIV_PERK_CONTENT: (await import('./build.mock')).SHIV_PERK_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/technology-level-content', async () => ({
  TECHNOLOGY_LEVEL_CONTENT: (await import('./build.mock')).TECHNOLOGY_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/perk-icons', () => ({ SHIV_PERK_ICON: {} }));

vi.mock('@entities/shiv/config/constants/technology-level-icons', () => ({ TECHNOLOGY_LEVEL_ICON: {} }));

describe('selectShivBuildPerk', () => {
  it('selects a perk on an empty level', () => {
    const build = createBuildMock(EMPTY_PERKS);

    selectShivBuildPerk(build, 1, 'middle');

    expect(build.perks).toEqual([null, 'middle', null]);
  });

  it('clears a level on a null perk and keeps the other levels', () => {
    const build = createBuildMock(FILLED_PERKS);

    selectShivBuildPerk(build, 1, null);

    expect(build.perks).toEqual(['left', null, 'right']);
  });

  it('switches the perk of a filled level', () => {
    const build = createBuildMock(FILLED_PERKS);

    selectShivBuildPerk(build, 0, 'other');

    expect(build.perks).toEqual(['other', 'middle', 'right']);
  });

  it('leaves the build untouched for a level outside the tree', () => {
    const build = createBuildMock(EMPTY_PERKS);

    selectShivBuildPerk(build, 3, 'left');

    expect(build.perks).toEqual(EMPTY_PERKS);
  });

  it('ignores a perk of another level', () => {
    const build = createBuildMock(EMPTY_PERKS);

    selectShivBuildPerk(build, 0, 'middle');

    expect(build.perks).toEqual(EMPTY_PERKS);
  });

  it('ignores a perk outside the SHIV tree', () => {
    const build = createBuildMock(FILLED_PERKS);

    selectShivBuildPerk(build, 1, 'missing');

    expect(build.perks).toEqual(FILLED_PERKS);
  });
});
