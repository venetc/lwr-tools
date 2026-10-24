import type { ShivPerk, TechnologyLevel } from '@entities/shiv';
import type { ShivBuild } from '@widgets/build-calculator/model/shiv-builds';

/**
 * SHIV perk with placeholder texts and icons.
 *
 * @param id perk id.
 */
const shivPerkMock = (id: string) => ({
  id,
  code: 0,
  name: id,
  description: `${id} description`,
  icon: { selected: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png` },
}) as unknown as ShivPerk;

export const RIGHT_PERK = shivPerkMock('right');

export const TECHNOLOGY_LEVELS_MOCK = [
  { id: 'first', name: 'First', perks: [shivPerkMock('left'), RIGHT_PERK] },
  { id: 'second', name: 'Second', perks: [shivPerkMock('top')] },
] as unknown as TechnologyLevel[];

/** Perk outside the SHIV tree of the mock. */
export const STRANGER_PERK = shivPerkMock('stranger');

/**
 * SHIV build with the selected perks.
 *
 * @param perks selected perks by technology level; null for an empty level.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (perks: (string | null)[], readonly = false): ShivBuild => ({
  id: 'build',
  perks,
  name: 'SHIV',
  readonly,
  outdated: null,
});

export const FIRST_FILLED_PERKS = ['right', null];

export const FIRST_FILLED_BUILD = createBuildMock(FIRST_FILLED_PERKS);

/** Arguments of the technology level state of each level of `FIRST_FILLED_PERKS` in a readonly build. */
export const READONLY_FIRST_FILLED_STATE_CALLS = [['right', true], [null, true]];
