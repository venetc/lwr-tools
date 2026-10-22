import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import { abilityPickerItems } from '../../model/ability-picker-item';
import { OFFICER_RANKS } from './officer-ranks';

/** Picker items of the officer perks by officer rank, built once: the officer ranks are static. */
export const OFFICER_RANK_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = OFFICER_RANKS.map(officerRank => abilityPickerItems(officerRank.perks));
