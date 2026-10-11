import type { ShivPerk } from '@entities/shiv/model/perks';
import type { TechnologyLevel } from '@entities/shiv/model/technology-levels';

/**
 * SHIV perk with placeholder texts and icons.
 *
 * @param id perk id.
 */
const perk = (id: string) => ({
  id,
  code: 0,
  name: id,
  description: `${id} description`,
  icon: { original: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png` },
}) as unknown as ShivPerk;

export const FIRST_PERK = perk('first');

export const SECOND_PERK = perk('second');

export const THIRD_PERK = perk('third');

export const LEVELS_MOCK = [
  { id: 'one', name: 'One', perks: [FIRST_PERK, perk('first-other')] },
  { id: 'two', name: 'Two', perks: [perk('second-other'), SECOND_PERK] },
  { id: 'three', name: 'Three', perks: [THIRD_PERK] },
] as unknown as TechnologyLevel[];

export const PARTLY_FILLED_PERKS = [null, 'second', null];

export const FILLED_PERKS = ['first', 'second', 'third'];

export const EMPTY_PERKS = [null, null, null];
