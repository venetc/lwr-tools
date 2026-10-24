import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ListNavItem } from '@shared/ui/list-nav';

import type { ListedBuild, NamedBuildData } from './build-list';

/**
 * Navigation item of a build, with the build for the item's slots.
 */
export interface BuildNavItem<Build> extends ListNavItem {
  /** Listed build. */
  build: Build
  /** Whether the build is an Outdated build. */
  isOutdated: boolean
}

/**
 * Builds as navigation items: name as the label, removable unless locked, marked if outdated.
 *
 * @param builds builds in page order.
 */
export const useBuildNavItems = <Build extends ListedBuild<NamedBuildData, unknown>>(builds: MaybeRefOrGetter<readonly Build[]>) => {
  return computed(() => toValue(builds).map((build): BuildNavItem<Build> => ({
    id: build.id,
    label: build.name,
    detail: null,
    isRemovable: !build.readonly,
    isCurrent: false,
    build,
    isOutdated: build.outdated !== null,
  })));
};
