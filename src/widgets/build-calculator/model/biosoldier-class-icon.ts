import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BiosoldierBranchSet, BiosoldierBuildData } from '@entities/soldier';
import { biosoldierBuildBranchSet } from '@entities/soldier';

/**
 * Stacked copies of the class icon in the colours of the build branches: one whole icon, or the gene mod and psionic
 * halves for both.
 *
 * @param build biosoldier build of the icon.
 * @param style CSS module of the icon.
 */
export const useBiosoldierClassIconLayers = (build: MaybeRefOrGetter<Readonly<BiosoldierBuildData>>, style: Record<string, string>) => {
  const branchSetLayers: Record<BiosoldierBranchSet, (string | undefined)[][]> = {
    'plain': [[style.icon, style.plain]],
    'gene-mods': [[style.icon, style.geneMods]],
    'psionic': [[style.icon, style.psionic]],
    'both': [[style.icon, style.geneModHalf], [style.icon, style.psionicHalf]],
  };

  return computed(() => branchSetLayers[biosoldierBuildBranchSet(toValue(build))]);
};
