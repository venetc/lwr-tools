import type { ShivOutdatedSelection, ShivPerk, TechnologyLevel } from '@entities/shiv';
import type { ShivBuild } from '@widgets/build-calculator/model/shiv-builds';

/**
 * Stub of `shivPerkById`: a SHIV perk named by its id, with placeholder texts and icons.
 *
 * @param id perk id.
 */
export const shivPerkByIdStub = (id: string) => ({
  id,
  code: 0,
  name: id,
  description: `${id} description`,
  icon: { selected: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png` },
}) as unknown as ShivPerk;

export const TECHNOLOGY_LEVELS_MOCK = [
  { id: 'first', name: 'First', perks: ['left', 'middle', 'right'].map(shivPerkByIdStub) },
  { id: 'second', name: 'Second', perks: ['top'].map(shivPerkByIdStub) },
] as unknown as TechnologyLevel[];

/** Outdated selections: left and right colliding on First, and gone removed from the SHIV tree. */
const OUTDATED_SELECTIONS = [
  { perkId: 'left', reason: 'collision', levelIndex: 0 },
  { perkId: 'gone', reason: 'removed' },
  { perkId: 'right', reason: 'collision', levelIndex: 0 },
] as unknown as ShivOutdatedSelection[];

/** Outdated SHIV build with left and right colliding on First, gone removed from the tree and top kept. */
export const OUTDATED_SHIV_BUILD: ShivBuild = {
  id: 'build',
  perks: [null, 'top'],
  name: 'SHIV',
  readonly: true,
  outdated: { code: 'code', selections: OUTDATED_SELECTIONS },
};

export const COLLISION_NOTE = 'Outdated selection: in this mod version left and right are both on First.';
