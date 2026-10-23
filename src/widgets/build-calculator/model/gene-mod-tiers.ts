import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BiosoldierBuildData, BodyPart, BuildBlockReason } from '@entities/soldier';
import { BODY_PARTS, bodyPartState, geneModBlockReason } from '@entities/soldier';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerAppearance, TieredPickerItem, TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { BODY_PART_PICKER_ITEMS, PSIONIC_BLOCK_NOTE } from '../config/constants';

/**
 * Biosoldier build shown in the gene mods: its gene mods and psionic abilities with its lock.
 */
export type GeneModTreeBuild = Readonly<Pick<BiosoldierBuildData, 'geneMods' | 'psionicAbilities'> & { readonly: boolean }>;

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
 * Option of a gene mod: Neural Damping is blocked and noted while any psionic ability is selected; otherwise the look
 * of `geneModAppearance`.
 *
 * @param item picker item of the gene mod.
 * @param selectedId id of the gene mod of the body part, or null.
 * @param isReadonly whether the build is readonly.
 * @param blockReason why a Build rule blocks the gene mod, or null.
 */
const geneModOption = (
  item: TieredPickerItem,
  selectedId: string | null,
  isReadonly: boolean,
  blockReason: BuildBlockReason | null,
): TieredPickerOption => {
  if (blockReason === 'psionic-ability') {
    return { item, appearance: 'disabled', isDisabled: true, note: PSIONIC_BLOCK_NOTE };
  }

  return { item, appearance: geneModAppearance(item.id, selectedId, isReadonly), isDisabled: false, note: null };
};

/**
 * Gene mods of the build as picker tiers by body part, and the item described while the user inspects none:
 * the gene mod of the last body part with one, otherwise the first gene mod of the first body part.
 *
 * @description Body parts are independent: an empty one is open for selection, one with a gene mod is completed.
 * A readonly build makes every body part unclickable and locks empty ones. Neural Damping is blocked with a note
 * while any psionic ability is selected. Picker items come from constants;
 * a selection only rebuilds the options.
 *
 * @param build biosoldier build with its lock.
 */
export const useGeneModTiers = (build: MaybeRefOrGetter<GeneModTreeBuild>) => {
  const tiers = computed(() => {
    const geneModTreeBuild = toValue(build);
    const { geneMods, readonly } = geneModTreeBuild;

    return BODY_PARTS.map((bodyPart, bodyPartIndex): BodyPartTier => {
      const selectedId = geneMods[bodyPartIndex] ?? null;

      return {
        id: bodyPart.id,
        name: bodyPart.name,
        bodyPart,
        state: bodyPartState(selectedId, readonly),
        isDisabled: readonly,
        selectedId,
        options: (BODY_PART_PICKER_ITEMS[bodyPartIndex] ?? []).map(item => (
          geneModOption(item, selectedId, readonly, geneModBlockReason(geneModTreeBuild, bodyPartIndex, item.id))
        )),
      };
    });
  });

  const featuredPickerItem = computed(() => {
    const { geneMods } = toValue(build);
    const bodyPartIndex = geneMods.reduce((lastIndex, geneModId, index) => (geneModId === null ? lastIndex : index), -1);
    const selectedPickerItem = BODY_PART_PICKER_ITEMS[bodyPartIndex]?.find(item => item.id === geneMods[bodyPartIndex]);

    return selectedPickerItem ?? BODY_PART_PICKER_ITEMS[0]?.[0] ?? null;
  });

  return { tiers, featuredPickerItem };
};
