import { describe, expect, it, vi } from 'vitest';

import { useBuildList } from '@features/manage-builds/model/build-list';

import {
  createOptionsMock,
  EDITABLE_ID,
  FOREIGN_IDENTITY_DATA,
  IMPORTED_DATA,
  LOCKED_BUILD,
  LOCKED_ID,
  NEW_NAME,
  REPLACED_EDITABLE_BUILD,
} from './build-list.mock';

vi.mock('@shared/lib/stored-list', async () => ({
  useStoredList: (await import('./build-list.mock')).useStoredListMock,
}));

describe('useBuildList', () => {
  it('imports data as a new editable build with its own id', () => {
    const buildList = useBuildList(createOptionsMock());

    buildList.importBuild(IMPORTED_DATA);

    expect(buildList.builds.value.at(-1)).toEqual({ ...IMPORTED_DATA, id: expect.any(String), readonly: false });
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

  it('finds no editable build for a locked one', () => {
    const buildList = useBuildList(createOptionsMock());

    const build = buildList.findEditableBuild(LOCKED_ID);

    expect(build).toBeNull();
  });
});
