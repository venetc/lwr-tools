import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerAppearance, TieredPickerItem, TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { NEURAL_DAMPING_ID } from '../config/constants/body-parts';
import { PSI_LEVEL_PICKER_ITEMS } from '../config/constants/psi-level-picker-items';
import { NEURAL_DAMPING_BLOCK_NOTE, PSI_LEVELS } from '../config/constants/psi-levels';
import type { BiosoldierBuildData } from './build';
import type { PsiLevel } from './psi-levels';
import { psiLevelState } from './psi-levels';
import type { RankState } from './ranks';

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
 * @param hasNeuralDamping whether the build has Neural Damping.
 */
const psionicOption = (
  item: TieredPickerItem,
  selectedId: string | null,
  levelState: RankState,
  isReadonly: boolean,
  hasNeuralDamping: boolean,
): TieredPickerOption => {
  if (hasNeuralDamping) return { item, appearance: 'disabled', isDisabled: true, note: NEURAL_DAMPING_BLOCK_NOTE };

  return { item, appearance: psionicAppearance(item.id, selectedId, levelState, isReadonly), isDisabled: false, note: null };
};

/**
 * Psionic abilities of the build as picker tiers by psi level, and the item described while the user inspects none:
 * the psionic ability of the highest trained level, otherwise the first ability of the first level.
 *
 * @description Psi levels are trained in order like ranks: trained levels are completed, the next one is available,
 * and the ones above are locked and unclickable. Neural Damping locks every level and blocks every ability with a note.
 * A readonly build makes every level unclickable. Picker items come from constants; a selection only rebuilds the options.
 *
 * @param build biosoldier build with its lock.
 */
export const usePsionicTiers = (build: MaybeRefOrGetter<PsionicTreeBuild>) => {
  const tiers = computed(() => {
    const { geneMods, psionicAbilities, readonly } = toValue(build);
    const hasNeuralDamping = geneMods.includes(NEURAL_DAMPING_ID);

    return PSI_LEVELS.map((psiLevel, levelIndex): PsiLevelTier => {
      const state = psiLevelState(psionicAbilities, levelIndex, readonly, hasNeuralDamping);
      const selectedId = psionicAbilities[levelIndex] ?? null;

      return {
        id: psiLevel.id,
        name: psiLevel.name,
        psiLevel,
        state,
        isDisabled: readonly || state === 'locked',
        selectedId,
        options: (PSI_LEVEL_PICKER_ITEMS[levelIndex] ?? []).map(item => psionicOption(item, selectedId, state, readonly, hasNeuralDamping)),
      };
    });
  });

  const featuredPickerItem = computed(() => {
    const { psionicAbilities } = toValue(build);
    const levelIndex = psionicAbilities.length - 1;
    const selectedPickerItem = PSI_LEVEL_PICKER_ITEMS[levelIndex]?.find(item => item.id === psionicAbilities[levelIndex]) ?? null;

    return selectedPickerItem ?? PSI_LEVEL_PICKER_ITEMS[0]?.[0] ?? null;
  });

  return { tiers, featuredPickerItem };
};
