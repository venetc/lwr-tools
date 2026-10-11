import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ListNavItem } from '@shared/ui/list-nav';
import type { SvgIcon } from '@shared/ui/svg-icon';

import type { BiosoldierBuild } from './biosoldier-builds';

/**
 * Navigation item of a biosoldier build, with the icon of its class.
 */
export interface BiosoldierBuildNavItem extends ListNavItem {
  /** Icon of the build class. */
  icon: SvgIcon
}

/**
 * Builds as navigation items: name as the label, removable unless locked, class icon.
 *
 * @param builds builds in page order.
 */
export const useBiosoldierBuildNavItems = (builds: MaybeRefOrGetter<readonly Readonly<BiosoldierBuild>[]>) => {
  return computed(() => toValue(builds).map((build): BiosoldierBuildNavItem => ({
    id: build.id,
    label: build.name,
    isRemovable: !build.readonly,
    icon: build.biosoldierClass.icon,
  })));
};
