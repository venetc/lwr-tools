import type { MaybeRefOrGetter } from 'vue';

import type { ListedBuild, NamedBuildData } from '@features/manage-builds';
import { useBuildNavItems } from '@features/manage-builds';

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
export const useBuildCalculatorNav = <Build extends ListedBuild<NamedBuildData>>(
  builds: MaybeRefOrGetter<readonly Build[]>,
  slots: BuildCalculatorSlots,
) => {
  const navItems = useBuildNavItems(builds);

  const hasNavIcon = Boolean(slots['nav-icon']);

  return { navItems, hasNavIcon };
};
