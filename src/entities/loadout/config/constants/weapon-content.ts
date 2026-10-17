import type { DeepReadonly } from '@shared/lib/object';

import type { WeaponContent } from '../../model/weapons';
import weaponsJson from '../data/weapons.json';

/** Weapon records by weapon id, from the game data. */
export const WEAPON_CONTENT: DeepReadonly<typeof weaponsJson> = weaponsJson satisfies Record<string, WeaponContent>;
