import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import type { AbilityId, TreeAbility } from './abilities';
import { treeAbility } from './abilities';

/**
 * Picker item of a tree ability, with the abilities it grants as related items.
 *
 * @param ability tree ability: a perk, a gene mod or a granted ability.
 */
export const treeAbilityPickerItem = (ability: TreeAbility): TieredPickerItem => ({
  id: ability.id,
  name: ability.name,
  description: ability.description,
  icon: ability.icon,
  related: ability.grants.map(treeAbilityPickerItem),
});

/**
 * Picker items of the abilities, with the abilities they grant.
 *
 * @param abilityIds ability ids.
 */
export const abilityPickerItems = (abilityIds: DeepReadonly<AbilityId[]>): TieredPickerItem[] => (
  abilityIds.map(abilityId => treeAbilityPickerItem(treeAbility(abilityId)))
);
