import type { DeepReadonly } from '@shared/lib/object';

import type { LoadoutIconPlaceholder } from '../../model/loadout-icons';

/** Placeholder colours of an item picture (armor, weapon, equipment, SHIV type): teal on a transparent background. */
export const ITEM_ICON_PLACEHOLDER: DeepReadonly<LoadoutIconPlaceholder> = { backdrop: 'transparent', glyph: '#4fa5a0' };

/** Placeholder colours of a non-perk ability icon: the cyan original on black. */
export const ABILITY_ICON_PLACEHOLDER: DeepReadonly<LoadoutIconPlaceholder> = { backdrop: '#000000', glyph: '#6be7ef' };
