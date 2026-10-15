import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerAppearance, TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { BODY_PART_ITEMS } from '../config/constants/body-part-items';
import { BODY_PARTS } from '../config/constants/body-parts';
import type { BodyPart } from './body-parts';
import { bodyPartState } from './body-parts';
import type { BiosoldierBuildData } from './build';

/**
 * Biosoldier build shown in the gene mods: its gene mods with its lock.
 */
export type GeneModTreeBuild = Readonly<Pick<BiosoldierBuildData, 'geneMods'> & { readonly: boolean }>;

/**
 * Picker tier of a body part.
 */
export interface BodyPartTier extends TieredPickerTier {
  /** Body part of the tier. */
  bodyPart: DeepReadonly<BodyPart>
}

/**
 * Look of a gene mod: the chosen one is selected; the other one stays available and replaces it,
 * except in a readonly build, where it is disabled.
 *
 * @param geneModId gene mod id.
 * @param selectedId id of the gene mod of the body part, or null.
 * @param isReadonly whether the build is readonly.
 */
const geneModAppearance = (geneModId: string, selectedId: string | null, isReadonly: boolean): TieredPickerAppearance => {
  if (geneModId === selectedId) return 'selected';
  if (isReadonly) return 'disabled';
  return 'available';
};

/**
 * Gene mods of the build as picker tiers by body part, and the item described while the user inspects none:
 * the gene mod of the last body part with one, otherwise the first gene mod of the first body part.
 *
 * @description Body parts are independent: an empty one is open for selection, one with a gene mod is completed.
 * A readonly build makes every body part unclickable and locks empty ones. Picker items come from constants;
 * a selection only rebuilds the options.
 *
 * @param build biosoldier build with its lock.
 */
export const useGeneModTiers = (build: MaybeRefOrGetter<GeneModTreeBuild>) => {
  const tiers = computed(() => {
    const { geneMods, readonly } = toValue(build);

    return BODY_PARTS.map((bodyPart, bodyPartIndex): BodyPartTier => {
      const selectedId = geneMods[bodyPartIndex] ?? null;

      return {
        id: bodyPart.id,
        name: bodyPart.name,
        bodyPart,
        state: bodyPartState(selectedId, readonly),
        isDisabled: readonly,
        selectedId,
        options: (BODY_PART_ITEMS[bodyPartIndex] ?? []).map((item): TieredPickerOption => ({
          item,
          appearance: geneModAppearance(item.id, selectedId, readonly),
          isDisabled: false,
          note: null,
        })),
      };
    });
  });

  const featuredItem = computed(() => {
    const { geneMods } = toValue(build);
    const bodyPartIndex = geneMods.reduce((lastIndex, geneModId, index) => (geneModId === null ? lastIndex : index), -1);
    const selectedItem = BODY_PART_ITEMS[bodyPartIndex]?.find(item => item.id === geneMods[bodyPartIndex]) ?? null;

    return selectedItem ?? BODY_PART_ITEMS[0]?.[0] ?? null;
  });

  return { tiers, featuredItem };
};
