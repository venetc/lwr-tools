import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { LoadoutItemId } from '../../model/loadout';
import type { Weapon, WeaponId } from '../../model/weapons';
import { weaponsFromEntry } from '../../model/weapons';
import { WEAPON_CONTENT } from './weapon-content';

/** All weapons in game data order; records with an unknown unit, tier, type or slot are skipped. */
export const WEAPONS: DeepReadonly<Weapon[]> = typedEntries(WEAPON_CONTENT).flatMap(weaponsFromEntry);

/** Weapons by weapon id; any other Loadout item id finds none. */
export const WEAPON_BY_ID: ReadonlyMap<LoadoutItemId, DeepReadonly<Weapon>> = new Map(WEAPONS.map(weapon => [weapon.id, weapon]));

/** Weapon ids by their stable code. */
export const WEAPON_ID_BY_CODE: ReadonlyMap<number, WeaponId> = new Map(WEAPONS.map(weapon => [weapon.code, weapon.id]));
