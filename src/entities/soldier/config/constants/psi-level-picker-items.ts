import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import { abilityPickerItems } from '../../model/ability-picker-item';
import { PSI_LEVELS } from './psi-levels';

/** Picker items of the psionic abilities by psi level, built once: the psi levels are static. */
export const PSI_LEVEL_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = PSI_LEVELS.map(psiLevel => abilityPickerItems(psiLevel.abilities));
