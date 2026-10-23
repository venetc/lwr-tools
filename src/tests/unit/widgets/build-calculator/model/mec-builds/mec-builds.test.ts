import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMecBuildsStore } from '@widgets/build-calculator/model/mec-builds';

import { stubPage } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';
import {
  DEFAULT_BUILDS,
  DEFAULT_VALKYRIE_BUILD,
  DEFAULT_VALKYRIE_ID,
  GOLIATH,
  LOCKED_PICKED_BUILD,
  LOCKED_VALKYRIE_BUILD,
  NEW_GOLIATH_BUILD,
  NEW_NAME,
  PICKED_PERKS,
  RENAMED_VALKYRIE_BUILD,
  SAVE_DELAY,
  storedBuild,
} from './mec-builds.mock';

vi.mock('@entities/soldier', async () => (await import('./mec-builds.mock')).SOLDIER_ENTITY_MOCK);

vi.mock('@entities/shiv', () => ({ TECHNOLOGY_LEVELS: [] }));

vi.mock('@features/share-build', async () => (await import('./mec-builds.mock')).SHARE_BUILD_MOCK);

beforeEach(() => {
  vi.useFakeTimers();
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useMecBuildsStore', () => {
  it('starts with a Default build of each MEC class', () => {
    stubPage();

    const store = useMecBuildsStore();

    expect(store.builds).toEqual(DEFAULT_BUILDS);
  });

  it('selects a perk of an editable build', () => {
    stubPage();
    const store = useMecBuildsStore();

    store.selectBuildPerk(DEFAULT_VALKYRIE_ID, 0, 'picked');

    expect(store.builds[0]?.perks).toEqual(PICKED_PERKS);
  });

  it('saves a perk selection', () => {
    const page = stubPage();
    const store = useMecBuildsStore();
    vi.advanceTimersByTime(SAVE_DELAY);

    store.selectBuildPerk(DEFAULT_VALKYRIE_ID, 0, 'picked');
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, DEFAULT_VALKYRIE_ID)).toHaveProperty('perks', PICKED_PERKS);
  });

  it('leaves a locked build as it is on a perk selection', () => {
    stubPage();
    const store = useMecBuildsStore();
    store.setReadonly(DEFAULT_VALKYRIE_ID, true);

    store.selectBuildPerk(DEFAULT_VALKYRIE_ID, 0, 'picked');

    expect(store.builds[0]).toEqual(LOCKED_VALKYRIE_BUILD);
  });

  it('adds a new build of the MEC class with only the base perk and returns its id', () => {
    stubPage();
    const store = useMecBuildsStore();

    const id = store.addBuild(GOLIATH);

    expect(store.builds.at(-1)).toEqual({ ...NEW_GOLIATH_BUILD, id });
  });

  it('saves an added build', () => {
    const page = stubPage();
    const store = useMecBuildsStore();

    const id = store.addBuild(GOLIATH);
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, id)).toEqual({ ...NEW_GOLIATH_BUILD, id });
  });

  it('resets an editable build to a new build of its MEC class and keeps the name', () => {
    stubPage();
    const store = useMecBuildsStore();
    store.setName(DEFAULT_VALKYRIE_ID, NEW_NAME);
    store.selectBuildPerk(DEFAULT_VALKYRIE_ID, 0, 'picked');

    store.resetBuild(DEFAULT_VALKYRIE_ID);

    expect(store.builds[0]).toEqual(RENAMED_VALKYRIE_BUILD);
  });

  it('saves a reset', () => {
    const page = stubPage();
    const store = useMecBuildsStore();
    store.selectBuildPerk(DEFAULT_VALKYRIE_ID, 0, 'picked');
    vi.advanceTimersByTime(SAVE_DELAY);

    store.resetBuild(DEFAULT_VALKYRIE_ID);
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, DEFAULT_VALKYRIE_ID)).toEqual(DEFAULT_VALKYRIE_BUILD);
  });

  it('leaves a locked build as it is on a reset', () => {
    stubPage();
    const store = useMecBuildsStore();
    store.selectBuildPerk(DEFAULT_VALKYRIE_ID, 0, 'picked');
    store.setReadonly(DEFAULT_VALKYRIE_ID, true);

    store.resetBuild(DEFAULT_VALKYRIE_ID);

    expect(store.builds[0]).toEqual(LOCKED_PICKED_BUILD);
  });
});
