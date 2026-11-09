import { describe, expect, it, vi } from 'vitest';

import { matchingBuilds, savedBuildFilters, savedBuildGroups } from '@pages/squads/model/saved-builds';

import {
  ALLOY_SUPPORT,
  BUILDS,
  FIELD_MEDIC,
  FILTER_COUNTS,
  FILTER_NAMES,
  GROUP_TITLES,
  IN_SQUAD_COUNTS,
  LONE_SCOUT,
  LONE_SHIV,
  OLD_SUPPORT,
  UNITS,
} from './saved-builds.mock';

vi.mock('@entities/soldier', async importOriginal => ({
  ...await importOriginal<typeof import('@entities/soldier')>(),
  soldierBuildSignatureSkill: (await import('./saved-builds.mock')).soldierBuildSignatureSkillStub,
}));

describe('matchingBuilds', () => {
  it('finds a build by its name in any case', () => {
    const builds = matchingBuilds(BUILDS, 'overwatch');

    expect(builds.map(item => item.build.name)).toEqual(['Overwatch Sniper']);
  });

  it('finds a build by its class', () => {
    const builds = matchingBuilds(BUILDS, ' Goliath ');

    expect(builds.map(item => item.build.name)).toEqual(['Goliath Wall']);
  });

  it('finds a build by its Signature skill in any case', () => {
    const builds = matchingBuilds(BUILDS, 'IN THE zone');

    expect(builds.map(item => item.build.name)).toEqual(['Overwatch Sniper']);
  });

  it('does not find a build without a Signature skill by a selected perk', () => {
    const builds = matchingBuilds([LONE_SCOUT], 'lone wolf');

    expect(builds).toEqual([]);
  });

  it('does not find a SHIV build by a Signature skill', () => {
    const builds = matchingBuilds([LONE_SHIV], 'lone wolf');

    expect(builds).toEqual([]);
  });

  it('finds a SHIV build by the unit name', () => {
    const builds = matchingBuilds(BUILDS, 'shiv');

    expect(builds.map(item => item.build.name)).toEqual(['Alloy Support']);
  });

  it('keeps every build for a blank query', () => {
    const builds = matchingBuilds(BUILDS, '  ');

    expect(builds).toHaveLength(4);
  });
});

describe('savedBuildFilters', () => {
  it('offers all builds and each unit type', () => {
    const filters = savedBuildFilters(BUILDS);

    expect(filters.map(filter => filter.name)).toEqual(FILTER_NAMES);
  });

  it('counts the builds of each filter', () => {
    const filters = savedBuildFilters(BUILDS);

    expect(filters.map(filter => filter.count)).toEqual(FILTER_COUNTS);
  });
});

describe('savedBuildGroups', () => {
  it('groups all builds by their Build calculator', () => {
    const groups = savedBuildGroups(BUILDS, 'all', []);

    expect(groups.map(group => group.title)).toEqual(GROUP_TITLES);
  });

  it('keeps only the group of the chosen unit type', () => {
    const groups = savedBuildGroups(BUILDS, 'mec', []);

    expect(groups.map(group => group.title)).toEqual(['MEC builds']);
  });

  it('leaves out a calculator without builds', () => {
    const groups = savedBuildGroups([FIELD_MEDIC], 'all', []);

    expect(groups.map(group => group.title)).toEqual(['Biosoldier builds']);
  });

  it('counts the Units of each build in the Squad', () => {
    const groups = savedBuildGroups(BUILDS, 'biosoldier', UNITS);

    expect(groups[0].rows.map(row => row.inSquadCount)).toEqual(IN_SQUAD_COUNTS);
  });

  it('shows the class of each build', () => {
    const groups = savedBuildGroups(BUILDS, 'biosoldier', []);

    expect(groups[0].rows.map(row => row.className)).toEqual(['Sniper', 'Medic']);
  });

  it('names the Signature skill of each build', () => {
    const groups = savedBuildGroups(BUILDS, 'biosoldier', []);

    expect(groups[0].rows.map(row => row.signatureSkill)).toEqual(['In The Zone', null]);
  });

  it('marks an Outdated build', () => {
    const groups = savedBuildGroups([ALLOY_SUPPORT, OLD_SUPPORT], 'shiv', []);

    expect(groups[0].rows.map(row => row.isOutdated)).toEqual([false, true]);
  });
});
