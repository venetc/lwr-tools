import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';
import type { TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { OUTDATED_SELECTION_WORDS } from '../config/constants';
import type { SavedBuild } from './build-list';
import type { BuildTreeTier } from './saved-tree';

/**
 * Requests of the build panel to its owner.
 */
export interface BuildPanelRequests {
  /** Requests a new build name. */
  onRename: (name: string) => void
  /** Requests locking or unlocking the build. */
  onLock: (isReadonly: boolean) => void
  /** Requests an item selection on a tier of the group; null clears the tier. */
  onSelect: (groupId: string, tierIndex: number, itemId: string | null) => void
}

/**
 * Build panel: name and lock as writable values that show the build and turn edits into requests, the actions on offer,
 * item selection, the tiers open for selection and the look of an Outdated build: frozen editing, the count of its
 * Outdated selections and its outdated cells.
 *
 * @description Locking hides the editing actions and removal. An Outdated build offers only the update and, unless
 * locked, removal.
 *
 * @param build build of the panel.
 * @param removable whether the panel offers removal of the build.
 * @param style CSS module of the panel.
 * @param requests requests to the panel owner.
 */
export const useBuildPanel = (
  build: MaybeRefOrGetter<Readonly<SavedBuild<LoadoutUnitId>>>,
  removable: MaybeRefOrGetter<boolean>,
  style: Record<string, string>,
  requests: BuildPanelRequests,
) => {
  const name = computed({
    get: () => toValue(build).name,
    set: requests.onRename,
  });

  const readonly = computed({
    get: () => toValue(build).readonly,
    set: requests.onLock,
  });

  const outdatedCount = computed(() => toValue(build).outdated?.selections.length ?? 0);

  const isOutdated = computed(() => toValue(build).outdated !== null);

  const isEditable = computed(() => !isOutdated.value);

  const isTitleReadonly = computed(() => readonly.value || isOutdated.value);

  const hasEditActions = computed(() => isEditable.value && !readonly.value);

  const isRemovable = computed(() => toValue(removable) && !readonly.value);

  const hasActions = computed(() => isEditable.value || isRemovable.value);

  const outdatedCountText = computed(() => `${outdatedCount.value} ${outdatedCount.value === 1 ? OUTDATED_SELECTION_WORDS.one : OUTDATED_SELECTION_WORDS.many}`);

  const outdatedUpdateLabel = computed(() => `${outdatedCountText.value}. Update build`);

  /**
   * Checks whether the tier is open for selection.
   *
   * @param tier picker tier.
   */
  const isTierHighlighted = (tier: TieredPickerTier) => tier.state === 'available';

  /**
   * Checks whether the cell shows an ability of the code of an Outdated build in place of the current one.
   *
   * @param tier tier of the cell.
   * @param option option of the cell.
   */
  const isOutdatedCell = (tier: BuildTreeTier, option: TieredPickerOption) => tier.outdatedItemIds.includes(option.item.id);

  /**
   * Class list of the cell: dashed-framed for an outdated cell.
   *
   * @param tier tier of the cell.
   * @param option option of the cell.
   */
  const getCellClass = (tier: BuildTreeTier, option: TieredPickerOption) => [style.cell, isOutdatedCell(tier, option) ? style.outdatedCell : style.currentCell];

  /**
   * Class of the cell icon: semi-transparent for an outdated cell; null for a current one.
   *
   * @param tier tier of the cell.
   * @param option option of the cell.
   */
  const getCellIconClass = (tier: BuildTreeTier, option: TieredPickerOption) => (isOutdatedCell(tier, option) ? style.outdatedIcon : null);

  return {
    name,
    readonly,
    isEditable,
    isTitleReadonly,
    hasEditActions,
    isRemovable,
    hasActions,
    outdatedCount,
    outdatedUpdateLabel,
    select: requests.onSelect,
    isTierHighlighted,
    isOutdatedCell,
    getCellClass,
    getCellIconClass,
  };
};
