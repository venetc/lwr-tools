import { createId } from '@shared/lib/id';
import type { LockableItem, StoredListOptions } from '@shared/lib/stored-list';
import { useStoredList } from '@shared/lib/stored-list';

/**
 * Build data a list can show: at least a name.
 */
export interface NamedBuildData {
  /** Build name shown in the heading and the navigation. */
  name: string
}

/**
 * Stored record of an Outdated build, kept as it is until the update.
 */
export interface OutdatedBuildRecord<Selection> {
  /** Share code of the stored record. */
  code: string
  /** Outdated selections of the code, which the list keeps without reading them. */
  selections: readonly Selection[]
}

/**
 * Build of a list: build data with its id, lock and Outdated build record.
 */
export type ListedBuild<Data, Selection> = LockableItem<Data> & {
  /** Stored record of an Outdated build, frozen until the update; null for a build that fits the current trees. */
  outdated: OutdatedBuildRecord<Selection> | null
};

/**
 * Options of a build list: how the builds are stored and what a reset turns a build into.
 */
export interface BuildListOptions<Data extends NamedBuildData, Selection> extends StoredListOptions<ListedBuild<Data, Selection>> {
  /** Data of a new build of the same kind as the build, for a reset; the list keeps the name, id and lock. */
  newData: (build: Readonly<ListedBuild<Data, Selection>>) => Data
}

/**
 * Builds of a Build calculator kept in the local storage and synced between tabs, with the operations every
 * calculator shares; the store of each build kind adds its own tree rules on top.
 *
 * @param options build list options.
 */
export const useBuildList = <Data extends NamedBuildData, Selection>(options: BuildListOptions<Data, Selection>) => {
  const buildList = useStoredList(options);

  /**
   * Editable build by id: null for a missing, locked or Outdated build.
   *
   * @param buildId build id.
   */
  const findEditableBuild = (buildId: string) => {
    const build = buildList.getItem(buildId);

    if (!build || build.readonly || build.outdated) return null;

    return build;
  };

  /**
   * Edits an editable build in place and saves it; a missing, locked or Outdated build is left as it is.
   *
   * @param buildId build id.
   * @param edit changes the build in place.
   */
  const editBuild = (buildId: string, edit: (build: ListedBuild<Data, Selection>) => void) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    edit(build);
    buildList.markItemChanged(buildId);
  };

  /**
   * Renames an editable build.
   *
   * @param buildId build id.
   * @param name new build name.
   */
  const setName = (buildId: string, name: string) => editBuild(buildId, (build) => {
    build.name = name;
  });

  /**
   * Locks or unlocks the build against editing; an Outdated build keeps its lock until the update.
   *
   * @param buildId build id.
   * @param isReadonly whether the build is locked.
   */
  const setReadonly = (buildId: string, isReadonly: boolean) => {
    const build = buildList.getItem(buildId);

    if (!build || build.outdated) return;

    build.readonly = isReadonly;
    buildList.markItemChanged(buildId);
  };

  /**
   * Adds a new editable build with a random id from the data; the build takes the data over, so the caller passes
   * fresh data and does not reuse it.
   *
   * @param data build data, such as imported data or the data of a new build.
   * @returns id of the new build.
   */
  const addBuild = (data: Data) => {
    const id = createId();

    buildList.addItem({ ...data, id, readonly: false, outdated: null });

    return id;
  };

  /**
   * Replaces the data of an editable build with imported data; id and lock stay. The build takes the data over,
   * so the caller passes fresh data and does not reuse it.
   *
   * @param buildId build id.
   * @param data imported build data.
   */
  const replaceBuild = (buildId: string, data: Data) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    Object.assign(build, data, { id: build.id, readonly: build.readonly });
    buildList.markItemChanged(buildId);
  };

  /**
   * Resets an editable build to the data of a new build of its kind; the name stays.
   *
   * @param buildId build id.
   */
  const resetBuild = (buildId: string) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    replaceBuild(buildId, { ...options.newData(build), name: build.name });
  };

  /**
   * Updates an Outdated build: drops its stored record and saves it with the code of its build, which already has no
   * Outdated selections. The lock is not checked and stays; a regular build is left as it is.
   *
   * @param buildId build id.
   */
  const updateBuild = (buildId: string) => {
    const build = buildList.getItem(buildId);

    if (!build?.outdated) return;

    build.outdated = null;
    buildList.markItemChanged(buildId);
  };

  return {
    builds: buildList.items,
    editBuild,
    addBuild,
    replaceBuild,
    resetBuild,
    setName,
    setReadonly,
    updateBuild,
    removeBuild: buildList.removeItem,
  };
};
