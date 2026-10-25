import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBiosoldierBuildsStore } from '@widgets/build-calculator/model/biosoldier-builds';

import { stubPage } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';
import {
  DEFAULT_ASSAULT_BUILD,
  DEFAULT_ASSAULT_ID,
  DEFAULT_BUILDS,
  LOCKED_ASSAULT_BUILD,
  LOCKED_PICKED_BUILD,
  NEW_NAME,
  NEW_SNIPER_BUILD,
  OUTDATED_BUILD,
  OUTDATED_ID,
  OUTDATED_STORAGE,
  RENAMED_ASSAULT_BUILD,
  SAVE_DELAY,
  SELECTIONS,
  SIGNATURE_ASSAULT_BUILD,
  SNIPER,
  storedBuild,
} from './biosoldier-builds.mock';

vi.mock('@entities/soldier', async () => (await import('./biosoldier-builds.mock')).SOLDIER_ENTITY_MOCK);

vi.mock('@entities/shiv', () => ({ TECHNOLOGY_LEVELS: [] }));

vi.mock('@widgets/build-calculator/model/stored-build', async () => (await import('./biosoldier-builds.mock')).STORED_BUILD_MOCK);

beforeEach(() => {
  vi.useFakeTimers();
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useBiosoldierBuildsStore', () => {
  it('starts with a Default build of each class', () => {
    stubPage();

    const store = useBiosoldierBuildsStore();

    expect(store.builds).toEqual(DEFAULT_BUILDS);
  });

  it.each(SELECTIONS)('applies $action to an editable build', ({ action, field, selected }) => {
    stubPage();
    const store = useBiosoldierBuildsStore();

    store[action](DEFAULT_ASSAULT_ID, 0, 'picked');

    expect(store.builds[0]?.[field]).toEqual(selected);
  });

  it.each(SELECTIONS)('saves $action', ({ action, field, selected }) => {
    const page = stubPage();
    const store = useBiosoldierBuildsStore();
    vi.advanceTimersByTime(SAVE_DELAY);

    store[action](DEFAULT_ASSAULT_ID, 0, 'picked');
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, DEFAULT_ASSAULT_ID)).toHaveProperty(field, selected);
  });

  it.each(SELECTIONS)('leaves a locked build as it is on $action', ({ action }) => {
    stubPage();
    const store = useBiosoldierBuildsStore();
    store.setReadonly(DEFAULT_ASSAULT_ID, true);

    store[action](DEFAULT_ASSAULT_ID, 0, 'picked');

    expect(store.builds[0]).toEqual(LOCKED_ASSAULT_BUILD);
  });

  it('sets the Signature skill of an editable build', () => {
    stubPage();
    const store = useBiosoldierBuildsStore();

    store.selectBuildSignatureSkill(DEFAULT_ASSAULT_ID, 'picked');

    expect(store.builds[0]).toEqual(SIGNATURE_ASSAULT_BUILD);
  });

  it('saves the Signature skill', () => {
    const page = stubPage();
    const store = useBiosoldierBuildsStore();
    vi.advanceTimersByTime(SAVE_DELAY);

    store.selectBuildSignatureSkill(DEFAULT_ASSAULT_ID, 'picked');
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, DEFAULT_ASSAULT_ID)).toEqual(SIGNATURE_ASSAULT_BUILD);
  });

  it('leaves a locked build as it is on a Signature skill', () => {
    stubPage();
    const store = useBiosoldierBuildsStore();
    store.setReadonly(DEFAULT_ASSAULT_ID, true);

    store.selectBuildSignatureSkill(DEFAULT_ASSAULT_ID, 'picked');

    expect(store.builds[0]).toEqual(LOCKED_ASSAULT_BUILD);
  });

  it('leaves an Outdated build as it is on a Signature skill', () => {
    stubPage(OUTDATED_STORAGE);
    const store = useBiosoldierBuildsStore();

    store.selectBuildSignatureSkill(OUTDATED_ID, 'picked');

    expect(store.builds[0]).toEqual(OUTDATED_BUILD);
  });

  it('keeps the Signature skill of an Outdated build on its update', () => {
    stubPage(OUTDATED_STORAGE);
    const store = useBiosoldierBuildsStore();

    store.updateBuild(OUTDATED_ID);

    expect(store.builds[0]?.signatureSkill).toBe('kept');
  });

  it('clears the Signature skill on a reset and keeps the name', () => {
    stubPage();
    const store = useBiosoldierBuildsStore();
    store.setName(DEFAULT_ASSAULT_ID, NEW_NAME);
    store.selectBuildSignatureSkill(DEFAULT_ASSAULT_ID, 'picked');

    store.resetBuild(DEFAULT_ASSAULT_ID);

    expect(store.builds[0]).toEqual(RENAMED_ASSAULT_BUILD);
  });

  it('adds a new build of the class with only the base perk and returns its id', () => {
    stubPage();
    const store = useBiosoldierBuildsStore();

    const id = store.addBuild(SNIPER);

    expect(store.builds.at(-1)).toEqual({ ...NEW_SNIPER_BUILD, id });
  });

  it('saves an added build', () => {
    const page = stubPage();
    const store = useBiosoldierBuildsStore();

    const id = store.addBuild(SNIPER);
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, id)).toEqual({ ...NEW_SNIPER_BUILD, id });
  });

  it('resets an editable build to a new build of its class and keeps the name', () => {
    stubPage();
    const store = useBiosoldierBuildsStore();
    store.setName(DEFAULT_ASSAULT_ID, NEW_NAME);
    SELECTIONS.forEach(({ action }) => store[action](DEFAULT_ASSAULT_ID, 0, 'picked'));

    store.resetBuild(DEFAULT_ASSAULT_ID);

    expect(store.builds[0]).toEqual(RENAMED_ASSAULT_BUILD);
  });

  it('saves a reset', () => {
    const page = stubPage();
    const store = useBiosoldierBuildsStore();
    store.selectBuildPerk(DEFAULT_ASSAULT_ID, 0, 'picked');
    vi.advanceTimersByTime(SAVE_DELAY);

    store.resetBuild(DEFAULT_ASSAULT_ID);
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(storedBuild(page, DEFAULT_ASSAULT_ID)).toEqual(DEFAULT_ASSAULT_BUILD);
  });

  it('leaves a locked build as it is on a reset', () => {
    stubPage();
    const store = useBiosoldierBuildsStore();
    store.selectBuildPerk(DEFAULT_ASSAULT_ID, 0, 'picked');
    store.setReadonly(DEFAULT_ASSAULT_ID, true);

    store.resetBuild(DEFAULT_ASSAULT_ID);

    expect(store.builds[0]).toEqual(LOCKED_PICKED_BUILD);
  });
});
