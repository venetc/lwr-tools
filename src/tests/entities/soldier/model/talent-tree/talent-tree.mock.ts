import type { SoldierTalentTree, Talent } from '@entities/soldier/model/talent-tree';

/**
 * Tree talent without grants.
 *
 * @param id talent id.
 */
const talent = (id: string): Talent => ({
  id,
  name: id,
  description: `${id} description`,
  icon: { original: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png` },
  grants: [],
});

export const GRANTED_TALENT = talent('granted');

export const LEFT_TALENT = talent('left');

export const RIGHT_TALENT = talent('right');

export const TOP_TALENT = talent('top');

export const TREE_MOCK = {
  name: 'Tester',
  ranks: [
    { id: 'first', name: 'First', talents: [GRANTED_TALENT] },
    { id: 'second', name: 'Second', talents: [LEFT_TALENT, RIGHT_TALENT] },
    { id: 'third', name: 'Third', talents: [TOP_TALENT] },
  ],
  baseBuild: ['granted'],
} as unknown as SoldierTalentTree;

export const EMPTY_TREE_MOCK = {
  name: 'Empty',
  ranks: [],
  baseBuild: [],
} as unknown as SoldierTalentTree;

export const BASE_BUILD = ['granted'];

export const PARTIAL_BUILD = ['granted', 'right'];
