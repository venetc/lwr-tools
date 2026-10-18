import { LOADOUT_REQUIREMENTS } from '../config/constants/loadout-requirements';

export type LoadoutRequirement = typeof LOADOUT_REQUIREMENTS[number];

/**
 * Whether the string is a known loadout requirement.
 *
 * @param requirement loadout requirement candidate from the game data.
 */
export const isLoadoutRequirement = (requirement: string): requirement is LoadoutRequirement => (LOADOUT_REQUIREMENTS as readonly string[]).includes(requirement);
