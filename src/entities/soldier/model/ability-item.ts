import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import type { AbilityId } from './abilities';
import type { TreeAbility } from './class-tree';
import { treeAbility } from './class-tree';

/**
 * Picker item of a tree ability, with the abilities it grants as related items.
 *
 * @param ability tree ability: a perk, a gene mod or a granted ability.
 */
export const treeAbilityItem = (ability: TreeAbility): TieredPickerItem => ({
  id: ability.id,
  name: ability.name,
  description: ability.description,
  icon: ability.icon,
  related: ability.grants.map(treeAbilityItem),
});

/**
 * Picker items of the abilities, with the abilities they grant.
 *
 * @param abilityIds ability ids.
 */
export const abilityItems = (abilityIds: DeepReadonly<AbilityId[]>): TieredPickerItem[] => (
  abilityIds.map(abilityId => treeAbilityItem(treeAbility(abilityId)))
);
