import type { ClassTree, TreeAbility } from '@entities/soldier/model/class-tree';

/**
 * Tree perk without grants.
 *
 * @param id perk id.
 */
const perk = (id: string): TreeAbility => ({
  id,
  name: id,
  description: `${id} description`,
  icon: { original: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png` },
  grants: [],
});

export const BASE_PERK = perk('granted');

export const LEFT_PERK = perk('left');

export const RIGHT_PERK = perk('right');

export const TOP_PERK = perk('top');

export const TREE_MOCK = {
  name: 'Tester',
  ranks: [
    { id: 'first', name: 'First', perks: [BASE_PERK] },
    { id: 'second', name: 'Second', perks: [LEFT_PERK, RIGHT_PERK] },
    { id: 'third', name: 'Third', perks: [TOP_PERK] },
  ],
} as unknown as ClassTree;

export const EMPTY_TREE_MOCK = {
  name: 'Empty',
  ranks: [],
} as unknown as ClassTree;

export const BASE_BUILD = ['granted'];

export const PARTIAL_BUILD = ['granted', 'right'];
