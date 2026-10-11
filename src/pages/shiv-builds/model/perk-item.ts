import type { ShivPerk } from '@entities/shiv';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

/**
 * Picker item of a SHIV perk.
 *
 * @param perk SHIV perk.
 */
export const shivPerkItem = (perk: DeepReadonly<ShivPerk>): TieredPickerItem => ({
  id: perk.id,
  name: perk.name,
  description: perk.description,
  icon: perk.icon,
  related: [],
});
