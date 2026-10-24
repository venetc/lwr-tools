import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useShivBuildsStore } from '@widgets/build-calculator/model/shiv-builds';

import { stubPage } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';
import {
  DEFAULT_SHIV_BUILD,
  DEFAULT_SHIV_ID,
  LOCKED_PICKED_BUILD,
  LOCKED_SHIV_BUILD,
  NEW_NAME,
  NEW_SHIV_BUILD,
  PICKED_PERKS,
  RENAMED_SHIV_BUILD,
  SAVE_DELAY,
  storedBuild,
} from './shiv-builds.mock';

vi.mock('@entities/shiv', async () => (await import('./shiv-builds.mock')).SHIV_ENTITY_MOCK);

vi.mock('@widgets/build-calculator/model/stored-build', async () => (await import('./shiv-builds.mock')).STORED_BUILD_MOCK);

beforeEach(() => {
  vi.useFakeTimers();
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useShivBuildsStore', () => {
  it('starts with one Default build without perks', () => {
    stubPage();

    const store = useShivBuildsStore();

    expect(store.builds).toEqual([DEFAULT_SHIV_BUILD]);
  });

  it('selects a perk of an editable build', () => {
    stubPage();
    const store = useShivBuildsStore();

    store.selectBuildPerk(DEFAULT_SHIV_ID, 1, 'picked');

    expect(store.builds[0]?.perks).toEqual(PICKED_PERKS);
  });

  it('saves a perk selection', () => {
    const page = stubPage();
    const store = useShivBuildsStore();
    vi.advanceTimersByTime(SAVE_DELAY);

    store.selectBuildPerk(DEFAULT_SHIV_ID, 1, 'picked');
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, DEFAULT_SHIV_ID)).toHaveProperty('perks', PICKED_PERKS);
  });

  it('leaves a locked build as it is on a perk selection', () => {
    stubPage();
    const store = useShivBuildsStore();
    store.setReadonly(DEFAULT_SHIV_ID, true);

    store.selectBuildPerk(DEFAULT_SHIV_ID, 1, 'picked');

    expect(store.builds[0]).toEqual(LOCKED_SHIV_BUILD);
  });

  it('adds a new build without perks and returns its id', () => {
    stubPage();
    const store = useShivBuildsStore();

    const id = store.addBuild();

    expect(store.builds.at(-1)).toEqual({ ...NEW_SHIV_BUILD, id });
  });

  it('saves an added build', () => {
    const page = stubPage();
    const store = useShivBuildsStore();

    const id = store.addBuild();
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, id)).toEqual({ ...NEW_SHIV_BUILD, id });
  });

  it('resets an editable build to a new build without perks and keeps the name', () => {
    stubPage();
    const store = useShivBuildsStore();
    store.setName(DEFAULT_SHIV_ID, NEW_NAME);
    store.selectBuildPerk(DEFAULT_SHIV_ID, 1, 'picked');

    store.resetBuild(DEFAULT_SHIV_ID);

    expect(store.builds[0]).toEqual(RENAMED_SHIV_BUILD);
  });

  it('saves a reset', () => {
    const page = stubPage();
    const store = useShivBuildsStore();
    store.selectBuildPerk(DEFAULT_SHIV_ID, 1, 'picked');
    vi.advanceTimersByTime(SAVE_DELAY);

    store.resetBuild(DEFAULT_SHIV_ID);
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, DEFAULT_SHIV_ID)).toEqual(DEFAULT_SHIV_BUILD);
  });

  it('leaves a locked build as it is on a reset', () => {
    stubPage();
    const store = useShivBuildsStore();
    store.selectBuildPerk(DEFAULT_SHIV_ID, 1, 'picked');
    store.setReadonly(DEFAULT_SHIV_ID, true);

    store.resetBuild(DEFAULT_SHIV_ID);

    expect(store.builds[0]).toEqual(LOCKED_PICKED_BUILD);
  });
});
