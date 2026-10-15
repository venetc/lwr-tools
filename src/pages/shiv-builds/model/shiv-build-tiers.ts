import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { TechnologyLevel } from '@entities/shiv';
import { featuredShivPerk, TECHNOLOGY_LEVELS, technologyLevelState } from '@entities/shiv';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerTier } from '@shared/ui/tiered-picker';
import { tierOption } from '@shared/ui/tiered-picker';

import { SHIV_PERK_ITEM_BY_ID, TECHNOLOGY_LEVEL_ITEMS } from '../config/constants';
import type { ShivBuild } from './shiv-builds';

/**
 * Picker tier of a technology level.
 */
export interface TechnologyLevelTier extends TieredPickerTier {
  /** Technology level of the tier. */
  level: DeepReadonly<TechnologyLevel>
}

/**
 * SHIV tree of the build as picker tiers, and the item described while the user inspects none.
 *
 * @description Picker items come from constants: the tree is static. Levels are independent: every level of an editable build can be changed at any time, as perks of
 * a SHIV can be swapped. A level without a selection is open for selection, a level with one is completed and its
 * unselected perks look disabled, as in the game, while still replacing the selection. A readonly build makes every level
 * unclickable and locks empty ones.
 *
 * @param build SHIV build.
 */
export const useShivBuildTiers = (build: MaybeRefOrGetter<Readonly<ShivBuild>>) => {
  const tiers = computed(() => {
    const { perks, readonly } = toValue(build);

    return TECHNOLOGY_LEVELS.map((level, levelIndex): TechnologyLevelTier => {
      const selectedId = perks[levelIndex] ?? null;
      const state = technologyLevelState(selectedId, readonly);

      return {
        id: level.id,
        name: level.name,
        level,
        state,
        isDisabled: readonly,
        selectedId,
        options: (TECHNOLOGY_LEVEL_ITEMS[levelIndex] ?? []).map(item => tierOption(item, state, selectedId)),
      };
    });
  });

  const featuredItem = computed(() => {
    const perk = featuredShivPerk(TECHNOLOGY_LEVELS, toValue(build).perks);

    if (!perk) return null;

    return SHIV_PERK_ITEM_BY_ID.get(perk.id) ?? null;
  });

  return { tiers, featuredItem };
};
