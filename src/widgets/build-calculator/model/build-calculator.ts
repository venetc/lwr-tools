import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';
import type { ListNavItem } from '@shared/ui/list-nav';

import type { SavedBuild } from './build-list';

export interface BuildCalculatorSlots {
  /** Icon of a build in the navigation. */
  'nav-icon'?: unknown
}

/**
 * Navigation item of a build, with the build for the item's slots.
 */
export interface BuildNavItem<Build> extends ListNavItem {
  /** Saved build. */
  build: Build
  /** Whether the build is an Outdated build. */
  isOutdated: boolean
}

/**
 * Navigation of the calculator: builds as its items — name as the label, removable unless locked, marked if outdated —
 * and whether they show an icon.
 *
 * @param builds builds of the calculator, in page order.
 * @param slots slots of the calculator.
 */
export const useBuildCalculatorNav = <Build extends SavedBuild<LoadoutUnitId>>(
  builds: MaybeRefOrGetter<readonly Build[]>,
  slots: BuildCalculatorSlots,
) => {
  const navItems = computed(() => toValue(builds).map((build): BuildNavItem<Build> => ({
    id: build.id,
    label: build.name,
    detail: null,
    isRemovable: !build.readonly,
    isCurrent: false,
    build,
    isOutdated: build.outdated !== null,
  })));

  const hasNavIcon = Boolean(slots['nav-icon']);

  return { navItems, hasNavIcon };
};
