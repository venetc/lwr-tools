import type { ShivOutdatedSelection, ShivPerkId } from '@entities/shiv';
import { shivPerkById, TECHNOLOGY_LEVELS } from '@entities/shiv';
import type { AbilityId, SoldierOutdatedSelection } from '@entities/soldier';
import { abilityById, BODY_PARTS, OFFICER_RANKS, PSI_LEVELS, SOLDIER_RANKS } from '@entities/soldier';
import type { SvgIcon } from '@shared/ui/svg-icon';

import { REMOVED_FROM_SHIV_TREE_NOTE, SHIV_TREE_SECTION, SOLDIER_STEP_SECTION } from '../config/constants';
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
 * Card ability of a soldier ability.
 *
 * @param abilityId ability id.
 */
const soldierCardAbility = (abilityId: AbilityId): OutdatedCardAbility => {
  const ability = abilityById(abilityId);

  return { id: ability.id, name: ability.name, icon: ability.icon.available };
};

/**
 * Step of a soldier Outdated selection on its card: its name with the rank icon of a rank or the medal of an officer
 * rank.
 *
 * @param selection soldier Outdated selection.
 */
const soldierCardStep = (selection: SoldierOutdatedSelection): Pick<OutdatedSelectionCard, 'stepName' | 'stepIcon' | 'stepImage'> => {
  switch (selection.stepKind) {
    case 'rank': {
      const rank = SOLDIER_RANKS[selection.stepIndex];

      return { stepName: rank?.name ?? null, stepIcon: rank?.icon ?? null, stepImage: null };
    }
    case 'body-part': {
      return { stepName: BODY_PARTS[selection.stepIndex]?.name ?? null, stepIcon: null, stepImage: null };
    }
    case 'psi-level': {
      return { stepName: PSI_LEVELS[selection.stepIndex]?.name ?? null, stepIcon: null, stepImage: null };
    }
    case 'officer-rank': {
      const officerRank = OFFICER_RANKS[selection.stepIndex];

      return { stepName: officerRank?.name ?? null, stepIcon: null, stepImage: officerRank?.medal ?? null };
    }
  }
};

/**
 * Cards of soldier Outdated selections, one per step in tree order: the ability of the code and the one the current
 * tree has at the same place.
 *
 * @param outdated Outdated selections of a soldier build code.
 */
const soldierOutdatedCards = (outdated: readonly SoldierOutdatedSelection[]): OutdatedSelectionCard[] => outdated.map(selection => ({
  id: `${selection.stepKind}-${selection.stepIndex}`,
  section: SOLDIER_STEP_SECTION[selection.stepKind],
  ...soldierCardStep(selection),
  codeAbilities: [soldierCardAbility(selection.abilityId)],
  current: soldierCardAbility(selection.currentAbilityId),
  note: null,
}));

/**
 * Cards of the Outdated selections of a Unit of a share code.
 *
 * @param unit Unit of a share code.
 * @returns the cards; empty for a Unit without Outdated selections.
 */
export const unitOutdatedCards = (unit: DecodedUnit): OutdatedSelectionCard[] => {
  if (isUnitOf(unit, 'shiv')) return shivOutdatedCards(unit.outdated);

  return soldierOutdatedCards(unit.outdated);
};
