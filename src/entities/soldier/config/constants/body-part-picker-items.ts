import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import { abilityPickerItems } from '../../model/ability-picker-item';
import { BODY_PARTS } from './body-parts';

/** Picker items of the gene mods by body part, built once: the body parts are static. */
export const BODY_PART_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = BODY_PARTS.map(bodyPart => abilityPickerItems(bodyPart.geneMods));
