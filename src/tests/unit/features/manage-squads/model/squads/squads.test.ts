import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSquadsStore } from '@features/manage-squads/model/squads';

import { changeInOtherTab, SAVE_DELAY, stubPage } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';
import { BUILD, CHECKED_UNITS, EMPTY_SQUAD_1, GONE_OPEN_SQUAD_STORAGE, OTHER_KIND_BUILD, SQUAD_KEY_PREFIX, UNIT_LOADOUT } from './squads.mock';

beforeEach(() => {
  vi.useFakeTimers();
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('setUnits', () => {
  it('replaces the Units of the Squad with the given ones', () => {
    stubPage();
    const store = useSquadsStore();
    const squadId = store.squads[0]?.id ?? '';
    store.addUnit(squadId, BUILD, UNIT_LOADOUT);

    store.setUnits(squadId, CHECKED_UNITS);

    expect(store.squads[0]?.units).toEqual(CHECKED_UNITS);
  });

  it('leaves the other Squads as they are', () => {
    stubPage();
    const store = useSquadsStore();
    const squadId = store.squads[0]?.id ?? '';
    store.addSquad();

    store.setUnits(squadId, CHECKED_UNITS);

    expect(store.squads[1]?.units).toEqual([]);
  });

  it('ignores a Squad that is not in the list', () => {
    stubPage();
    const store = useSquadsStore();

    store.setUnits('missing-squad', CHECKED_UNITS);

    expect(store.squads[0]?.units).toEqual([]);
  });
});

describe('removeBuildUnits', () => {
  it('removes the Units of the build from every Squad', () => {
    stubPage();
    const store = useSquadsStore();
    store.addUnit(store.squads[0]?.id ?? '', BUILD, UNIT_LOADOUT);
    store.addSquad();
    store.addUnit(store.squads[1]?.id ?? '', BUILD, UNIT_LOADOUT);
    store.addUnit(store.squads[1]?.id ?? '', BUILD, UNIT_LOADOUT);

    store.removeBuildUnits(BUILD);

    expect(store.squads.map(squad => squad.units.length)).toEqual([0, 0]);
  });

  it('keeps the Units of a build of another kind with the same id', () => {
    stubPage();
    const store = useSquadsStore();
    const squadId = store.squads[0]?.id ?? '';
    store.addUnit(squadId, BUILD, UNIT_LOADOUT);
    store.addUnit(squadId, OTHER_KIND_BUILD, UNIT_LOADOUT);

    store.removeBuildUnits(BUILD);

    expect(store.squads[0]?.units.map(unit => unit.build)).toEqual([OTHER_KIND_BUILD]);
  });

  it('stores the Squads without the Units', () => {
    stubPage();
    const store = useSquadsStore();
    const squadId = store.squads[0]?.id ?? '';
    store.addUnit(squadId, BUILD, UNIT_LOADOUT);
    vi.advanceTimersByTime(SAVE_DELAY);
    store.removeBuildUnits(BUILD);
    vi.advanceTimersByTime(SAVE_DELAY);
    setActivePinia(createPinia());

    const nextStore = useSquadsStore();

    expect(nextStore.squads[0]?.units).toEqual([]);
  });
});

describe('removeSquad', () => {
  it('leaves an empty `Squad 1` after the last Squad is removed', () => {
    stubPage();
    const store = useSquadsStore();

    store.removeSquad(store.squads[0]?.id ?? '');

    expect(store.squads).toEqual([EMPTY_SQUAD_1]);
  });

  it('opens the new `Squad 1` after the last Squad is removed', () => {
    stubPage();
    const store = useSquadsStore();

    store.removeSquad(store.squads[0]?.id ?? '');

    expect(store.openSquad?.id).toBe(store.squads[0]?.id);
  });

  it('opens the Squad that takes the place of the removed open one', () => {
    stubPage();
    const store = useSquadsStore();
    store.addSquad();
    const removedId = store.openSquad?.id ?? '';
    store.addSquad();
    store.switchSquad(removedId);

    store.removeSquad(removedId);

    expect(store.openSquad?.id).toBe(store.squads[1]?.id);
  });

  it('opens the previous Squad when the removed open one was last', () => {
    stubPage();
    const store = useSquadsStore();
    store.addSquad();

    store.removeSquad(store.openSquad?.id ?? '');

    expect(store.openSquad?.id).toBe(store.squads[0]?.id);
  });

  it('keeps the open Squad when another one is removed', () => {
    stubPage();
    const store = useSquadsStore();
    const firstId = store.squads[0]?.id ?? '';
    store.addSquad();
    store.addSquad();
    const openId = store.openSquad?.id;

    store.removeSquad(firstId);

    expect(store.openSquad?.id).toBe(openId);
  });

  it('keeps the Squads when a missing Squad is removed', () => {
    stubPage();
    const store = useSquadsStore();
    const squads = [...store.squads];

    store.removeSquad('missing-squad');

    expect(store.squads).toEqual(squads);
  });
});

describe('openSquad', () => {
  it('falls back to the first Squad when the remembered one is gone', () => {
    stubPage(GONE_OPEN_SQUAD_STORAGE);

    const store = useSquadsStore();

    expect(store.openSquad?.name).toBe('Alpha');
  });

  it('falls back to the first Squad when another tab removes the open one', () => {
    const page = stubPage();
    const store = useSquadsStore();
    store.addSquad();

    changeInOtherTab(page, `${SQUAD_KEY_PREFIX}${store.openSquad?.id}`, null);

    expect(store.openSquad?.id).toBe(store.squads[0]?.id);
  });

  it('opens the switched Squad on the next visit', () => {
    stubPage();
    const store = useSquadsStore();
    store.addSquad();
    const openId = store.openSquad?.id;
    vi.advanceTimersByTime(SAVE_DELAY);
    setActivePinia(createPinia());

    const nextStore = useSquadsStore();

    expect(nextStore.openSquad?.id).toBe(openId);
  });
});

describe('storing', () => {
  it('restores the Squads with their Units on the next visit', () => {
    stubPage();
    const store = useSquadsStore();
    store.addUnit(store.squads[0]?.id ?? '', BUILD, UNIT_LOADOUT);
    store.addSquad();
    const squads = store.squads;
    vi.advanceTimersByTime(SAVE_DELAY);
    setActivePinia(createPinia());

    const nextStore = useSquadsStore();

    expect(nextStore.squads).toEqual(squads);
  });
});
