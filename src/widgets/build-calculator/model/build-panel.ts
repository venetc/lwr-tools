import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ListedBuild, NamedBuildData } from '@features/manage-builds';
import type { TieredPickerTier } from '@shared/ui/tiered-picker';

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
 * Build panel: name and lock as writable values that show the build and turn edits into requests, item selection
 * and the tiers open for selection.
 *
 * @param build build of the panel.
 * @param requests requests to the panel owner.
 */
export const useBuildPanel = (build: MaybeRefOrGetter<Readonly<ListedBuild<NamedBuildData>>>, requests: BuildPanelRequests) => {
  const name = computed({
    get: () => toValue(build).name,
    set: requests.onRename,
  });

  const readonly = computed({
    get: () => toValue(build).readonly,
    set: requests.onLock,
  });

  /**
   * Checks whether the tier is open for selection.
   *
   * @param tier picker tier.
   */
  const isTierHighlighted = (tier: TieredPickerTier) => tier.state === 'available';

  return { name, readonly, select: requests.onSelect, isTierHighlighted };
};
