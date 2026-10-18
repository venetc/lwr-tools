import { describe, expect, it } from 'vitest';

import { defaultSquads, nextSquadName } from '@features/manage-squads/model/squad';

import { DEFAULT_SQUADS } from './squad.mock';

describe('defaultSquads', () => {
  it('is one empty Squad 1 with a fixed id', () => {
    const squads = defaultSquads();

    expect(squads).toEqual(DEFAULT_SQUADS);
  });
});

describe('nextSquadName', () => {
  it('is Squad 1 with no Squads', () => {
    const name = nextSquadName([]);

    expect(name).toBe('Squad 1');
  });

  it('takes the number after the taken ones', () => {
    const name = nextSquadName(['Squad 1', 'Squad 2']);

    expect(name).toBe('Squad 3');
  });

  it('takes the smallest free number', () => {
    const name = nextSquadName(['Squad 2', 'Alpha']);

    expect(name).toBe('Squad 1');
  });
});
