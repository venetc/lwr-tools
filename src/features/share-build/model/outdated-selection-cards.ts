import type { ShivOutdatedSelection, ShivPerkId } from '@entities/shiv';
import { shivPerkById, TECHNOLOGY_LEVELS } from '@entities/shiv';
import type { SvgIcon } from '@shared/ui/svg-icon';

import { REMOVED_FROM_SHIV_TREE_NOTE, SHIV_TREE_SECTION } from '../config/constants';
import type { DecodedUnit } from './unit-code';
import { isUnitOf } from './unit-code';

/**
 * Ability on an Outdated selection card.
 */
export interface OutdatedCardAbility {
  /** Ability id. */
  id: string
  /** Ability name. */
  name: string
  /** Icon of the ability available to select. */
  icon: string
}

/**
 * Card of an Outdated selection: the step on the left, the abilities of the code, and what the step has now on the
 * right.
 */
export interface OutdatedSelectionCard {
  /** Card id, unique in its group. */
  id: string
  /** Section of the step, such as `SHIV tree`. */
  section: string
  /** Step name; null for a perk gone from the SHIV tree, which has no step now. */
  stepName: string | null
  /** Rank icon of the step; null for none. */
  stepIcon: SvgIcon | null
  /** Image of the step, such as an Officer rank medal; null for none. */
  stepImage: string | null
  /** Abilities of the code on the step; two or more for a SHIV collision. */
  codeAbilities: OutdatedCardAbility[]
  /** Ability of the current tree at the same place; null for an empty cell. */
  current: OutdatedCardAbility | null
  /** Note under the empty cell; null next to a current ability. */
  note: string | null
}

/**
 * Cards of the Outdated selections of one build, under the name of its Unit.
 */
export interface OutdatedSelectionGroup {
  /** Group id. */
  id: string
  /** Unit or build name. */
  name: string
  /** Cards in tree order. */
  cards: OutdatedSelectionCard[]
}

/**
 * Card ability of a SHIV perk.
 *
 * @param perkId SHIV perk id.
 */
const shivCardAbility = (perkId: ShivPerkId): OutdatedCardAbility => {
  const perk = shivPerkById(perkId);

  return { id: perk.id, name: perk.name, icon: perk.icon.available };
};

/**
 * Cards of SHIV Outdated selections: one per technology level with colliding perks, in tree order, then one per perk
 * gone from the SHIV tree. A collision of more than two perks is noted «All on …» in place of «Both on …».
 *
 * @param outdated Outdated selections of a SHIV build code.
 */
const shivOutdatedCards = (outdated: readonly ShivOutdatedSelection[]): OutdatedSelectionCard[] => {
  const collisionCards = TECHNOLOGY_LEVELS.flatMap((level, levelIndex): OutdatedSelectionCard[] => {
    const perkIds = outdated.flatMap(selection => (selection.reason === 'collision' && selection.levelIndex === levelIndex ? [selection.perkId] : []));

    if (!perkIds.length) return [];

    return [{
      id: level.id,
      section: SHIV_TREE_SECTION,
      stepName: level.name,
      stepIcon: level.icon,
      stepImage: null,
      codeAbilities: perkIds.map(shivCardAbility),
      current: null,
      note: `${perkIds.length > 2 ? 'All' : 'Both'} on ${level.name} now`,
    }];
  });

  const removedCards = outdated.flatMap((selection): OutdatedSelectionCard[] => {
    if (selection.reason !== 'removed') return [];

    return [{
      id: selection.perkId,
      section: SHIV_TREE_SECTION,
      stepName: null,
      stepIcon: null,
      stepImage: null,
      codeAbilities: [shivCardAbility(selection.perkId)],
      current: null,
      note: REMOVED_FROM_SHIV_TREE_NOTE,
    }];
  });

  return [...collisionCards, ...removedCards];
};

/**
 * Cards of the Outdated selections of a Unit of a share code.
 *
 * @param unit Unit of a share code.
 * @returns the cards; empty for a Unit without Outdated selections.
 */
export const unitOutdatedCards = (unit: DecodedUnit): OutdatedSelectionCard[] => {
  if (isUnitOf(unit, 'shiv')) return shivOutdatedCards(unit.outdated);

  return [];
};
