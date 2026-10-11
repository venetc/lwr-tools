import { createId } from '@shared/lib/id';
import type { StoredListOptions } from '@shared/lib/stored-list';
import { useStoredList } from '@shared/lib/stored-list';

/**
 * Build data a list can show: at least a name.
 */
export interface NamedBuildData {
  /** Build name shown in the heading and the navigation. */
  name: string
}

/**
 * Build as a list keeps it: its data with a stable id and a lock.
 */
export type ListedBuild<Data extends NamedBuildData> = Data & {
  /** Stable build id, unique in the list. */
  id: string
  /** Whether the build is locked against editing. */
  readonly: boolean
};

/**
 * Builds of a Build calculator kept in the local storage and synced between tabs, with the operations every
 * calculator shares; a page store adds its own tree rules on top.
 *
 * @param options stored list options of the builds.
 */
export const useBuildList = <Data extends NamedBuildData>(options: StoredListOptions<ListedBuild<Data>>) => {
  const buildList = useStoredList(options);

  /**
   * Editable build by id: null for a missing or locked build.
   *
   * @param buildId build id.
   */
  const findEditableBuild = (buildId: string) => {
    const build = buildList.getItem(buildId);

    if (!build || build.readonly) return null;

    return build;
  };

  /**
   * Renames an editable build.
   *
   * @param buildId build id.
   * @param name new build name.
   */
  const setName = (buildId: string, name: string) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    build.name = name;
    buildList.markItemChanged(buildId);
  };

  /**
   * Locks or unlocks the build against editing.
   *
   * @param buildId build id.
   * @param isReadonly whether the build is locked.
   */
  const setReadonly = (buildId: string, isReadonly: boolean) => {
    const build = buildList.getItem(buildId);

    if (!build) return;

    build.readonly = isReadonly;
    buildList.markItemChanged(buildId);
  };

  /**
   * Adds a new editable build with a random id from imported data; the build takes the data over,
   * so the caller passes fresh data and does not reuse it.
   *
   * @param data imported build data.
   */
  const importBuild = (data: Data) => buildList.addItem({ ...data, id: createId(), readonly: false });

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

  return {
    builds: buildList.items,
    findEditableBuild,
    markBuildChanged: buildList.markItemChanged,
    addBuild: buildList.addItem,
    importBuild,
    replaceBuild,
    setName,
    setReadonly,
    removeBuild: buildList.removeItem,
  };
};
