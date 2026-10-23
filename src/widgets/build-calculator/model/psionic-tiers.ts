import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BiosoldierBuildData, BuildBlockReason, PsiLevel, RankState } from '@entities/soldier';
import { highestSelectedStepIndex, PSI_LEVELS, psiLevelState, psionicAbilityBlockReason } from '@entities/soldier';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerAppearance, TieredPickerItem, TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { NEURAL_DAMPING_BLOCK_NOTE, PSI_LEVEL_PICKER_ITEMS } from '../config/constants';

/**
 * Biosoldier build shown in the psionic tree: its gene mods and psionic abilities with its lock.
 */
export type PsionicTreeBuild = Readonly<Pick<BiosoldierBuildData, 'geneMods' | 'psionicAbilities'> & { readonly: boolean }>;

/**
 * Picker tier of a psi level.
 */
export interface PsiLevelTier extends TieredPickerTier {
  /** Psi level of the tier. */
  psiLevel: DeepReadonly<PsiLevel>
}

/**
 * Look of a psionic ability: the chosen one is selected; the others of an open or trained level stay available
 * and replace it, except in a readonly build or on a locked level, where they are disabled.
 *
 * @param abilityId psionic ability id.
 * @param selectedId id of the psionic ability of the level, or null.
 * @param levelState state of the psi level.
 * @param isReadonly whether the build is readonly.
 */
const psionicAppearance = (
  abilityId: string,
  selectedId: string | null,
  levelState: RankState,
  isReadonly: boolean,
): TieredPickerAppearance => {
  if (abilityId === selectedId) return 'selected';
  if (isReadonly || levelState === 'locked') return 'disabled';
  return 'available';
};

/**
 * Option of a psionic ability: blocked and noted under Neural Damping, otherwise with the look of `psionicAppearance`.
 *
 * @param item picker item of the psionic ability.
 * @param selectedId id of the psionic ability of the level, or null.
 * @param levelState state of the psi level.
 * @param isReadonly whether the build is readonly.
 * @param blockReason why a Build rule blocks the psi level, or null.
 */
const psionicOption = (
  item: TieredPickerItem,
  selectedId: string | null,
  levelState: RankState,
  isReadonly: boolean,
  blockReason: BuildBlockReason | null,
): TieredPickerOption => {
  if (blockReason === 'neural-damping') return { item, appearance: 'disabled', isDisabled: true, note: NEURAL_DAMPING_BLOCK_NOTE };

  return { item, appearance: psionicAppearance(item.id, selectedId, levelState, isReadonly), isDisabled: false, note: null };
};

/**
 * Psionic abilities of the build as picker tiers by psi level, and the item described while the user inspects none:
 * the psionic ability of the highest trained level, otherwise the first ability of the first level.
 *
 * @description Psi levels are taken in any order like ranks: trained levels are completed, and empty ones are available,
 * or locked and unclickable in a readonly build. Neural Damping locks every level and blocks every ability with a note.
 * A readonly build makes every level unclickable. Picker items come from constants; a selection only rebuilds the options.
 *
 * @param build biosoldier build with its lock.
 */
export const usePsionicTiers = (build: MaybeRefOrGetter<PsionicTreeBuild>) => {
  const tiers = computed(() => {
    const psionicTreeBuild = toValue(build);
    const { psionicAbilities, readonly } = psionicTreeBuild;

    return PSI_LEVELS.map((psiLevel, levelIndex): PsiLevelTier => {
      const blockReason = psionicAbilityBlockReason(psionicTreeBuild, levelIndex, null);
      const selectedId = psionicAbilities[levelIndex] ?? null;
      const state = psiLevelState(selectedId, readonly, blockReason !== null);

      return {
        id: psiLevel.id,
        name: psiLevel.name,
        psiLevel,
        state,
        isDisabled: readonly || state === 'locked',
        selectedId,
        options: (PSI_LEVEL_PICKER_ITEMS[levelIndex] ?? []).map(item => psionicOption(item, selectedId, state, readonly, blockReason)),
      };
    });
  });

  const featuredPickerItem = computed(() => {
    const { psionicAbilities } = toValue(build);
    const levelIndex = highestSelectedStepIndex(psionicAbilities);
    const selectedPickerItem = PSI_LEVEL_PICKER_ITEMS[levelIndex]?.find(item => item.id === psionicAbilities[levelIndex]);

    return selectedPickerItem ?? PSI_LEVEL_PICKER_ITEMS[0]?.[0] ?? null;
  });

  return { tiers, featuredPickerItem };
};
