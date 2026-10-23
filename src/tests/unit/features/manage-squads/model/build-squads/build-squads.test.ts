import { describe, expect, it } from 'vitest';

import { buildRemovalNote, buildSquads } from '@features/manage-squads/model/build-squads';

import { BUILD, BUILD_SQUADS, BUILD_SQUADS_NOTE, ONE_UNIT_NOTE, ONE_UNIT_SQUADS, SQUADS } from './build-squads.mock';

describe('buildSquads', () => {
  it('lists the Squads the build stands in with the number of its Units, in Squad order', () => {
    const squads = buildSquads(SQUADS, BUILD);

    expect(squads).toEqual(BUILD_SQUADS);
  });

  it('is empty for a build in no Squad', () => {
    const squads = buildSquads(SQUADS, { kind: 'shiv', id: 'build-1' });

    expect(squads).toEqual([]);
  });
});

describe('buildRemovalNote', () => {
  it('lists the Squads with their Units and tells how many Units go', () => {
    const note = buildRemovalNote(BUILD_SQUADS);

    expect(note).toBe(BUILD_SQUADS_NOTE);
  });

  it('tells of the only Unit in the singular', () => {
    const note = buildRemovalNote(ONE_UNIT_SQUADS);

    expect(note).toBe(ONE_UNIT_NOTE);
  });
});
