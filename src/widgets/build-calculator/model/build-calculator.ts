import type { MaybeRefOrGetter } from 'vue';

import type { NamedBuildData } from '@features/manage-builds';
import { useBuildNavItems } from '@features/manage-builds';
import type { LockableItem } from '@shared/lib/stored-list';

export interface BuildCalculatorSlots {
  /** Icon of a build in the navigation. */
  'nav-icon'?: unknown
}

/**
 * Navigation of the calculator: its items and whether they show an icon.
 *
 * @param builds builds of the calculator, in page order.
 * @param slots slots of the calculator.
 */
export const useBuildCalculatorNav = <Build extends LockableItem<NamedBuildData>>(
  builds: MaybeRefOrGetter<readonly Build[]>,
  slots: BuildCalculatorSlots,
) => {
  const navItems = useBuildNavItems(builds);

  const hasNavIcon = Boolean(slots['nav-icon']);

  return { navItems, hasNavIcon };
};
