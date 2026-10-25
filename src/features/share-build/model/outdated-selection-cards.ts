import type { LoadoutUnitId } from '@entities/loadout';
import type { ShivOutdatedSelection, ShivPerkId } from '@entities/shiv';
import { shivPerkById, TECHNOLOGY_LEVELS } from '@entities/shiv';
import type { AbilityId, SoldierOutdatedSelection } from '@entities/soldier';
import { abilityById, BODY_PARTS, OFFICER_RANKS, PSI_LEVELS, SOLDIER_RANKS } from '@entities/soldier';
import type { ImagePlaceholder } from '@shared/ui/loading-image';
import type { SvgIcon } from '@shared/ui/svg-icon';

import { EMPTY_STEP_NOTE, REMOVED_FROM_SHIV_TREE_NOTE, SHIV_TREE_SECTION, SOLDIER_STEP_SECTION } from '../config/constants';
import type { OutdatedSelectionByKind } from './build-code';
import type { DecodedSquadBuild, DecodedSquadBuildOf } from './squad-code';

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
  /** Placeholder colours shown until the icon loads. */
  iconPlaceholder: ImagePlaceholder
}

/**
 * Image of a step on an Outdated selection card, such as an Officer rank medal.
 */
export interface OutdatedCardImage {
  /** Image URL. */
  src: string
  /** Placeholder colours shown until the image loads. */
  placeholder: ImagePlaceholder
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
  stepImage: OutdatedCardImage | null
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
  /** Build name as the heading of the group; null for the single build of a code, which needs no heading. */
  name: string | null
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

  return { id: perk.id, name: perk.name, icon: perk.icon.available, iconPlaceholder: perk.icon.placeholder.available };
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

  return { id: ability.id, name: ability.name, icon: ability.icon.available, iconPlaceholder: ability.icon.placeholder.available };
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

      if (!officerRank) return { stepName: null, stepIcon: null, stepImage: null };

      const stepImage = { src: officerRank.medal, placeholder: officerRank.medalPlaceholder };

      return { stepName: officerRank.name, stepIcon: null, stepImage };
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

/** Cards of the Outdated selections of each unit type. */
const OUTDATED_CARDS_BY_KIND: { readonly [Kind in LoadoutUnitId]: (outdated: readonly OutdatedSelectionByKind[Kind][]) => OutdatedSelectionCard[] } = {
  biosoldier: soldierOutdatedCards,
  mec: soldierOutdatedCards,
  shiv: shivOutdatedCards,
};

/**
 * Cards of the Outdated selections of a build of the kind.
 *
 * @param kind unit type of the build.
 * @param outdated Outdated selections of the build.
 * @returns the cards; empty for a build without Outdated selections.
 */
const outdatedCardsOf = <Kind extends LoadoutUnitId>(kind: Kind, outdated: readonly OutdatedSelectionByKind[Kind][]) => {
  const outdatedCards: (outdated: readonly OutdatedSelectionByKind[Kind][]) => OutdatedSelectionCard[] = OUTDATED_CARDS_BY_KIND[kind];

  return outdatedCards(outdated);
};

/**
 * Cards of the Outdated selections of a build of a share code.
 *
 * @param squadBuild build of a share code with its kind and Outdated selections.
 * @returns the cards; empty for a build without Outdated selections.
 */
const buildOutdatedCards = <Kind extends LoadoutUnitId>(squadBuild: DecodedSquadBuildOf<Kind>) => outdatedCardsOf(squadBuild.kind, squadBuild.outdated);

/**
 * Card groups of the Outdated selections of the builds of a share code: a group per build that has them, in the order
 * of the builds. Units of one build share its group. A code of several builds names each group after its build, even if
 * only one of them has Outdated selections.
 *
 * @param builds builds of a share code: the build of a Unit or the builds of a Squad.
 * @returns the groups; empty if no build has Outdated selections.
 */
export const outdatedSelectionGroups = (builds: readonly DecodedSquadBuild[]) => builds.reduce<OutdatedSelectionGroup[]>((groups, squadBuild, index) => {
  if (!squadBuild.outdated.length) return groups;

  groups.push({ id: `build-${index}`, name: builds.length > 1 ? squadBuild.build.name : null, cards: buildOutdatedCards(squadBuild) });

  return groups;
}, []);

/**
 * Card group of the update of an Outdated build of the kind: its cards with the empty cell «Empty» on the right, as
 * every step of an Outdated selection stays empty after the update.
 *
 * @param kind unit type of the build.
 * @param outdated Outdated selections of the build.
 * @returns the group; empty for a build without Outdated selections.
 */
export const outdatedUpdateGroups = <Kind extends LoadoutUnitId>(kind: Kind, outdated: readonly OutdatedSelectionByKind[Kind][]): OutdatedSelectionGroup[] => {
  if (!outdated.length) return [];

  const cards = outdatedCardsOf(kind, outdated).map(card => ({ ...card, current: null, note: EMPTY_STEP_NOTE }));

  return [{ id: 'update', name: null, cards }];
};
