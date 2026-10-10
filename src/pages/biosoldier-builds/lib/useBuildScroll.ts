import { usePreferredReducedMotion } from '@vueuse/core';

import type { BiosoldierBuildId } from '../model/biosoldier-builds';

/**
 * Scrolling the page to build panels, instant when the user prefers reduced motion.
 */
export const useBuildScroll = () => {
  const reducedMotion = usePreferredReducedMotion();

  /**
   * Element id of the build panel.
   *
   * @param buildId build id.
   */
  const panelId = (buildId: BiosoldierBuildId) => `build-${buildId}`;

  /**
   * Scrolls the page to the build panel.
   *
   * @param buildId build id.
   */
  const scrollToBuild = (buildId: BiosoldierBuildId) => {
    const panel = document.getElementById(panelId(buildId));

    if (!panel) return;

    panel.scrollIntoView({ behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth', block: 'start' });
  };

  return { panelId, scrollToBuild };
};
