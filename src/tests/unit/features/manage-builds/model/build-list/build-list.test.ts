import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBuildList } from '@features/manage-builds/model/build-list';

import { SAVE_DELAY, stubPage } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';
import {
  createOptionsMock,
  EDITABLE_ID,
  EDITABLE_KEY,
  EDITED_PERKS,
  EDITED_RECORD,
  FOREIGN_IDENTITY_DATA,
  IMPORTED_DATA,
  LOCKED_BUILD,
  LOCKED_ID,
  LOCKED_OUTDATED_ID,
  NEW_NAME,
  OUTDATED_BUILD,
  OUTDATED_ID,
  OUTDATED_KEY,
  REPLACED_EDITABLE_BUILD,
  RESET_EDITABLE_BUILD,
  UPDATED_BUILD,
  UPDATED_LOCKED_BUILD,
  UPDATED_RECORD,
} from './build-list.mock';

beforeEach(() => {
  vi.useFakeTimers();
  stubPage();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useBuildList', () => {
  it('edits an editable build in place', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.editBuild(EDITABLE_ID, build => build.perks.push('top'));

    expect(buildList.builds.value[0]?.perks).toEqual(EDITED_PERKS);
  });

  it('saves an edit', () => {
    const page = stubPage();
    const buildList = useBuildList(createOptionsMock());
    vi.advanceTimersByTime(SAVE_DELAY);

    buildList.editBuild(EDITABLE_ID, build => build.perks.push('top'));
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(page.values.get(EDITABLE_KEY)).toBe(EDITED_RECORD);
  });

  it('resets an editable build to new data and keeps the name', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.resetBuild(EDITABLE_ID);

    expect(buildList.builds.value[0]).toEqual(RESET_EDITABLE_BUILD);
  });

  it('leaves a locked build unreset', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.resetBuild(LOCKED_ID);

    expect(buildList.builds.value[1]).toEqual(LOCKED_BUILD);
  });

  it('leaves a locked build unedited', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.editBuild(LOCKED_ID, build => build.perks.push('top'));

    expect(buildList.builds.value[1]).toEqual(LOCKED_BUILD);
  });

  it('adds data as a new editable build and returns its id', () => {
    const buildList = useBuildList(createOptionsMock());

    const id = buildList.addBuild(IMPORTED_DATA);

    expect(buildList.builds.value.at(-1)).toEqual({ ...IMPORTED_DATA, id, readonly: false, outdated: null });
  });

  it('gives an added build the returned id when the data carries another', () => {
    const buildList = useBuildList(createOptionsMock());

    const id = buildList.addBuild(FOREIGN_IDENTITY_DATA);

    expect(buildList.builds.value.at(-1)?.id).toBe(id);
  });

  it('replaces the data of an editable build', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.replaceBuild(EDITABLE_ID, IMPORTED_DATA);

    expect(buildList.builds.value[0]).toEqual(REPLACED_EDITABLE_BUILD);
  });

  it('keeps the id and the lock when the data carries others', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.replaceBuild(EDITABLE_ID, FOREIGN_IDENTITY_DATA);

    expect(buildList.builds.value[0]).toEqual(REPLACED_EDITABLE_BUILD);
  });

  it('leaves a locked build unreplaced', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.replaceBuild(LOCKED_ID, IMPORTED_DATA);

    expect(buildList.builds.value[1]).toEqual(LOCKED_BUILD);
  });

  it('leaves a locked build unrenamed', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.setName(LOCKED_ID, NEW_NAME);

    expect(buildList.builds.value[1]).toEqual(LOCKED_BUILD);
  });

  it('renames an editable build', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.setName(EDITABLE_ID, NEW_NAME);

    expect(buildList.builds.value[0]?.name).toBe(NEW_NAME);
  });

  it('unlocks a locked build', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.setReadonly(LOCKED_ID, false);

    expect(buildList.builds.value[1]?.readonly).toBe(false);
  });

  it('leaves an Outdated build unedited', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.editBuild(OUTDATED_ID, build => build.perks.push('top'));

    expect(buildList.builds.value[2]).toEqual(OUTDATED_BUILD);
  });

  it('leaves an Outdated build unrenamed', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.setName(OUTDATED_ID, NEW_NAME);

    expect(buildList.builds.value[2]).toEqual(OUTDATED_BUILD);
  });

  it('leaves an Outdated build unreset', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.resetBuild(OUTDATED_ID);

    expect(buildList.builds.value[2]).toEqual(OUTDATED_BUILD);
  });

  it('leaves an Outdated build unreplaced', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.replaceBuild(OUTDATED_ID, IMPORTED_DATA);

    expect(buildList.builds.value[2]).toEqual(OUTDATED_BUILD);
  });

  it('leaves an Outdated build unlocked', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.setReadonly(OUTDATED_ID, true);

    expect(buildList.builds.value[2]).toEqual(OUTDATED_BUILD);
  });

  it('removes an Outdated build', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.removeBuild(OUTDATED_ID);

    expect(buildList.builds.value.map(build => build.id)).not.toContain(OUTDATED_ID);
  });

  it('updates an Outdated build into a regular one', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.updateBuild(OUTDATED_ID);

    expect(buildList.builds.value[2]).toEqual(UPDATED_BUILD);
  });

  it('saves an updated build', () => {
    const page = stubPage();
    const buildList = useBuildList(createOptionsMock());
    vi.advanceTimersByTime(SAVE_DELAY);

    buildList.updateBuild(OUTDATED_ID);
    vi.advanceTimersByTime(SAVE_DELAY);

    expect(page.values.get(OUTDATED_KEY)).toBe(UPDATED_RECORD);
  });

  it('updates a locked Outdated build and keeps it locked', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.updateBuild(LOCKED_OUTDATED_ID);

    expect(buildList.builds.value[3]).toEqual(UPDATED_LOCKED_BUILD);
  });

  it('leaves a regular build as it is on an update', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.updateBuild(LOCKED_ID);

    expect(buildList.builds.value[1]).toEqual(LOCKED_BUILD);
  });
});
