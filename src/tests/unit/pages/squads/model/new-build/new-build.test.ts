import { describe, expect, it, vi } from 'vitest';

import { newBuildGroup } from '@pages/squads/model/new-build';

import { BIOSOLDIER_GROUP, BIOSOLDIER_UNIT, MEC_GROUP, MEC_UNIT, SHIV_GROUP, SHIV_UNIT } from './new-build.mock';

vi.mock('@entities/soldier', async () => (await import('./new-build.mock')).SOLDIER_ENTITY_MOCK);

vi.mock('@widgets/build-calculator', async () => (await import('../squad-builds/squad-builds.mock')).BUILD_CALCULATOR_MOCK);

describe('newBuildGroup', () => {
  it('offers a Default build of each biosoldier class', () => {
    const group = newBuildGroup(BIOSOLDIER_UNIT);

    expect(group).toEqual(BIOSOLDIER_GROUP);
  });

  it('offers a Default build of each MEC class', () => {
    const group = newBuildGroup(MEC_UNIT);

    expect(group).toEqual(MEC_GROUP);
  });

  it('offers a single Default build of a SHIV', () => {
    const group = newBuildGroup(SHIV_UNIT);

    expect(group).toEqual(SHIV_GROUP);
  });
});
