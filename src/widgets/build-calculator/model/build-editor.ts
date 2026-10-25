import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';
import type { BuildDataByKind } from '@features/share-build';

import type { SavedBuild } from './build-list';

/**
 * Store actions a build editor works through.
 */
export interface BuildEditorActions<Data> {
  /** Renames an editable build. */
  setName: (buildId: string, name: string) => void
  /** Locks or unlocks a build. */
  setReadonly: (buildId: string, isReadonly: boolean) => void
  /** Replaces an editable build with imported data. */
  replaceBuild: (buildId: string, data: Data) => void
  /** Resets an editable build to a new build of its kind; the name stays. */
  resetBuild: (buildId: string) => void
  /** Updates an Outdated build: its Outdated selections are cleared for good. */
  updateBuild: (buildId: string) => void
}

/**
 * Selects an item on a tier of the group; null clears the tier.
 */
export type BuildTreeSelect = (groupId: string, tierIndex: number, itemId: string | null) => void;

/**
 * Editing of one build of a build tree through its store: handlers of the build panel events for renaming, locking,
 * replacement, reset, the update of an Outdated build and selection. Every edit of what the build holds once it is
 * made — a selection, a reset, an import and an update — is told to the owner of the tree; renaming and locking leave
 * what the build holds as it is and tell nothing. Removal is not editing: the owner of the panel decides whether and
 * how a build is removed.
 *
 * @param build build to edit.
 * @param actions store actions.
 * @param selectItem selection in the groups of the tree.
 * @param onChange tells the owner of the tree of an edit of what the build holds.
 */
export const useBuildEditor = <Kind extends LoadoutUnitId>(
  build: MaybeRefOrGetter<Readonly<SavedBuild<Kind>>>,
  actions: BuildEditorActions<BuildDataByKind[Kind]>,
  selectItem: BuildTreeSelect,
  onChange: () => void,
) => {
  /**
   * Renames the build.
   *
   * @param name new build name.
   */
  const rename = (name: string) => actions.setName(toValue(build).id, name);

  /**
   * Locks or unlocks the build.
   *
   * @param isReadonly whether the build becomes readonly.
   */
  const lock = (isReadonly: boolean) => actions.setReadonly(toValue(build).id, isReadonly);

  /**
   * Replaces the build with imported data and tells of the edit.
   *
   * @param data imported build data.
   */
  const replace = (data: BuildDataByKind[Kind]) => {
    actions.replaceBuild(toValue(build).id, data);
    onChange();
  };

  /**
   * Resets the build to a new build of its kind, keeping the name, and tells of the edit.
   */
  const reset = () => {
    actions.resetBuild(toValue(build).id);
    onChange();
  };

  /**
   * Updates the Outdated build, clearing its Outdated selections for good, and tells of the edit.
   */
  const update = () => {
    actions.updateBuild(toValue(build).id);
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

  return { rename, lock, replace, reset, update, select };
};

/**
 * Store actions a soldier build editor works through: the actions of a build editor and the Signature skill.
 */
export interface SoldierBuildEditorActions<Data> extends BuildEditorActions<Data> {
  /** Sets the Signature skill of an editable build, or clears it. */
  selectBuildSignatureSkill: (buildId: string, perkId: string | null) => void
}

/**
 * Editing of one Biosoldier or MEC build through its store, as `useBuildEditor`, and of its Signature skill, told to
 * the owner of the tree as an edit of what the build holds.
 *
 * @param build build to edit.
 * @param actions store actions.
 * @param selectItem selection in the groups of the tree.
 * @param onChange tells the owner of the tree of an edit of what the build holds.
 */
export const useSoldierBuildEditor = <Kind extends 'biosoldier' | 'mec'>(
  build: MaybeRefOrGetter<Readonly<SavedBuild<Kind>>>,
  actions: SoldierBuildEditorActions<BuildDataByKind[Kind]>,
  selectItem: BuildTreeSelect,
  onChange: () => void,
) => {
  const editor = useBuildEditor(build, actions, selectItem, onChange);

  /**
   * Sets the Signature skill of the build, or clears it, and tells of the edit.
   *
   * @param perkId perk id of the Signature skill, or null to clear it.
   */
  const selectSignatureSkill = (perkId: string | null) => {
    actions.selectBuildSignatureSkill(toValue(build).id, perkId);
    onChange();
  };

  return { ...editor, selectSignatureSkill };
};
