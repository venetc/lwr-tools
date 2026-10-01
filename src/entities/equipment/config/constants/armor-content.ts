import type { DeepReadonly } from '@shared/lib/object';

import type { ArmorContent } from '../../model/armors';
import armorsJson from '../data/armors.json';

/** Armor records by armor id, from the game data. */
export const ARMOR_CONTENT: DeepReadonly<typeof armorsJson> = armorsJson satisfies Record<string, ArmorContent>;
