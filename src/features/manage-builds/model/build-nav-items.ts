import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { LockableItem } from '@shared/lib/stored-list';
import type { ListNavItem } from '@shared/ui/list-nav';

import type { NamedBuildData } from './build-list';

/**
 * Navigation item of a build, with the build for the item's slots.
 */
export interface BuildNavItem<Build> extends ListNavItem {
  /** Listed build. */
  build: Build
}

/**
 * Builds as navigation items: name as the label, removable unless locked.
 *
 * @param builds builds in page order.
 */
export const useBuildNavItems = <Build extends LockableItem<NamedBuildData>>(builds: MaybeRefOrGetter<readonly Build[]>) => {
  return computed(() => toValue(builds).map((build): BuildNavItem<Build> => ({
    id: build.id,
    label: build.name,
    detail: null,
    isRemovable: !build.readonly,
    isCurrent: false,
    build,
  })));
};
