import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BiosoldierBranch } from './biosoldier-branches';
import type { MiniTreeRow, MiniTreeStepState } from './mini-tree';

/**
 * Rows of a mini-tree with their classes: the title in the colour of its branch and each step in its look; the icon of
 * an outdated step is semi-transparent.
 *
 * @param rows rows of the mini-tree.
 * @param style CSS module of the mini-tree.
 */
export const useMiniTreeViews = (rows: MaybeRefOrGetter<readonly MiniTreeRow[]>, style: Record<string, string>) => {
  const titleToneClass: Record<BiosoldierBranch, string | undefined> = {
    'class-tree': style.classTreeTitle,
    'gene-mods': style.geneModsTitle,
    'psionic': style.psionicTitle,
    'officer': style.classTreeTitle,
  };

  const cellStateClass: Record<MiniTreeStepState, string | undefined> = {
    selected: style.selectedCell,
    outdated: style.outdatedCell,
    open: style.openCell,
    locked: style.lockedCell,
  };

  return computed(() => toValue(rows).map(row => ({
    row,
    titleClass: [style.title, titleToneClass[row.tone]],
    steps: row.steps.map(step => ({
      step,
      cellClass: [style.cell, cellStateClass[step.state]],
      iconClass: [style.icon, step.state === 'outdated' ? style.outdatedIcon : style.currentIcon],
    })),
  })));
};
