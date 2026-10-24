import type { AbilityContent, TreeAbility } from '@entities/soldier/model/abilities';
import type { ClassTree } from '@entities/soldier/model/class-tree';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';

/**
 * Tree perk without grants.
 *
 * @param id perk id.
 */
const perk = (id: string): TreeAbility => ({
  id,
  name: id,
  description: `${id} description`,
  icon: { selected: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png` },
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

export const PARTIAL_BUILD = ['granted', 'right', null];

export const GAPPED_BUILD = ['granted', null, 'top'];

export const BASE_BUILD = ['granted', null, null];

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  granted: { code: 10, name: 'Granted', description: 'Granted by the class.' },
  left: { code: 11, name: 'Left', description: 'Left choice.' },
  right: { code: 12, name: 'Right', description: 'Right choice.' },
  top: { code: 13, name: 'Top', description: 'Top choice.' },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

export const SOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  perks: { third: ['top'], first: ['granted'], second: ['left', 'right'] },
  basePerk: 'granted',
} as unknown as SoldierClass;
