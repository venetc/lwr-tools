import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSquadBuilds } from '@pages/squads/model/squad-builds';

import {
  GOLIATH_OPTION,
  MEC_SQUAD_BUILD,
  NEW_GOLIATH_SQUAD_BUILD,
  NEW_SHIV_SQUAD_BUILD,
  NEW_SNIPER_SQUAD_BUILD,
  resetStoresMock,
  SHARED_ID,
  SHIV_OPTION,
  SNIPER_OPTION,
  SQUAD_BUILDS,
} from './squad-builds.mock';

vi.mock('@widgets/build-calculator', async () => (await import('./squad-builds.mock')).BUILD_CALCULATOR_MOCK);

beforeEach(() => {
  resetStoresMock();
});

describe('useSquadBuilds', () => {
  it('lists the biosoldier, then the MEC, then the SHIV builds', () => {
    const { squadBuilds } = useSquadBuilds();

    expect(squadBuilds.value).toEqual(SQUAD_BUILDS);
  });

  it('finds the build of the kind a Unit refers to among builds with the same id', () => {
    const { findSquadBuild } = useSquadBuilds();

    const squadBuild = findSquadBuild({ kind: 'mec', id: SHARED_ID });

    expect(squadBuild).toEqual(MEC_SQUAD_BUILD);
  });

  it('finds nothing for a build that is no longer saved', () => {
    const { findSquadBuild } = useSquadBuilds();

    const squadBuild = findSquadBuild({ kind: 'mec', id: 'gone' });

    expect(squadBuild).toBeNull();
  });

  it('adds a Default build of the class to the biosoldier Build calculator', () => {
    const { findSquadBuild, addDefaultBuild } = useSquadBuilds();

    const build = addDefaultBuild(SNIPER_OPTION);

    expect(build && findSquadBuild(build)).toEqual(NEW_SNIPER_SQUAD_BUILD);
  });

  it('adds a Default build of the MEC class to the MEC Build calculator', () => {
    const { findSquadBuild, addDefaultBuild } = useSquadBuilds();

    const build = addDefaultBuild(GOLIATH_OPTION);

    expect(build && findSquadBuild(build)).toEqual(NEW_GOLIATH_SQUAD_BUILD);
  });

  it('adds a Default build to the SHIV Build calculator', () => {
    const { findSquadBuild, addDefaultBuild } = useSquadBuilds();

    const build = addDefaultBuild(SHIV_OPTION);

    expect(build && findSquadBuild(build)).toEqual(NEW_SHIV_SQUAD_BUILD);
  });
});
