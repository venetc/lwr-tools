import type { WeaponContent, WeaponId } from '@entities/loadout/model/weapons';

/**
 * Weapon record with zero stats besides the given fields.
 *
 * @param content fields that differ from the empty record.
 */
const weaponMock = (content: Pick<WeaponContent, 'code' | 'name' | 'type' | 'slot'> & Partial<WeaponContent>): WeaponContent => ({
  unit: 'biosoldier',
  damage: 0,
  penetration: 0,
  crit: 0,
  aim: 0,
  ammo: 0,
  mobility: 0,
  range: 0,
  utilitySlots: 0,
  info: '',
  ...content,
});

export const UNTIERED_ENTRY: [WeaponId, WeaponContent] = ['arc-rifle', weaponMock({ code: 30, name: 'Arc', type: 'arc-rifle', slot: 'primary' })];

export const UNKNOWN_TIER_ENTRY: [WeaponId, WeaponContent] = ['laser-rifle', weaponMock({ code: 17, name: 'Laser', tier: 'electric', type: 'assault-rifle', slot: 'primary' })];
