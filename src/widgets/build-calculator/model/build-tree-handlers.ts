/**
 * Handlers of a build editor for the build panel events.
 */
export interface BuildTreeEditor<Data> {
  /** Renames the build. */
  rename: (name: string) => void
  /** Locks or unlocks the build. */
  lock: (isReadonly: boolean) => void
  /** Replaces the build with imported data. */
  replace: (data: Data) => void
  /** Resets the build to a new build of its kind; the name stays. */
  reset: () => void
  /** Updates the Outdated build: its Outdated selections are cleared for good. */
  update: () => void
}

/**
 * Selects an item on a tier of the group; null clears the tier.
 */
export type BuildTreeSelect = (groupId: string, tierIndex: number, itemId: string | null) => void;

/**
 * Handlers of a build tree for the build panel events that tell its owner of every edit of what the build holds once
 * it is made: a selection, a reset, an import and the update of an Outdated build. Renaming and locking leave what the build holds as it is and tell
 * nothing.
 *
 * @param editor handlers of the build editor.
 * @param selectItem selection in the groups of the tree.
 * @param onChange tells the owner of the tree of an edit of what the build holds.
 */
export const useBuildTreeHandlers = <Data>(editor: BuildTreeEditor<Data>, selectItem: BuildTreeSelect, onChange: () => void) => {
  /**
   * Replaces the build with imported data and tells of the edit.
   *
   * @param data imported build data.
   */
  const replace = (data: Data) => {
    editor.replace(data);
    onChange();
  };

  /**
   * Resets the build and tells of the edit.
   */
  const reset = () => {
    editor.reset();
    onChange();
  };

  /**
   * Updates the Outdated build and tells of the edit.
   */
  const update = () => {
    editor.update();
    onChange();
  };

  /**
   * Selects an item on a tier of the group, or clears the tier, and tells of the edit.
   *
   * @param groupId group id.
   * @param tierIndex tier index.
   * @param itemId selected item id, or null to clear the tier.
   */
  const select = (groupId: string, tierIndex: number, itemId: string | null) => {
    selectItem(groupId, tierIndex, itemId);
    onChange();
  };

  return { rename: editor.rename, lock: editor.lock, replace, reset, update, select };
};
