import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSquadsStore } from '@features/manage-squads/model/squads';

import { BUILD, CHECKED_UNITS, createPageTargetMock, UNIT_LOADOUT } from './squads.mock';

describe('setUnits', () => {
  beforeEach(() => {
    vi.stubGlobal('window', createPageTargetMock());
    vi.stubGlobal('document', createPageTargetMock());
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('replaces the Units of the Squad with the given ones', () => {
    const store = useSquadsStore();
    const squadId = store.squads[0]?.id ?? '';
    store.addUnit(squadId, BUILD, UNIT_LOADOUT);

    store.setUnits(squadId, CHECKED_UNITS);

    expect(store.squads[0]?.units).toEqual(CHECKED_UNITS);
  });

  it('leaves the other Squads as they are', () => {
    const store = useSquadsStore();
    const squadId = store.squads[0]?.id ?? '';
    store.addSquad();

    store.setUnits(squadId, CHECKED_UNITS);

    expect(store.squads[1]?.units).toEqual([]);
  });

  it('ignores a Squad that is not in the list', () => {
    const store = useSquadsStore();

    store.setUnits('missing-squad', CHECKED_UNITS);

    expect(store.squads[0]?.units).toEqual([]);
  });
});
