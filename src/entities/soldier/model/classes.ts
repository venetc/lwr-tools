import { typedEntries } from '@shared/lib/object';
import type { SvgIcon } from '@shared/ui/svg-icon';

import { SOLDIER_RANKS } from '../config/constants/soldier-ranks';
import type biosoldierClassesJson from '../config/data/biosoldier-classes.json';
import type { AbilityId } from './abilities';
import { isAbilityId } from './abilities';
import type { SoldierRankId } from './ranks';

export type BiosoldierClassId = keyof typeof biosoldierClassesJson;

export type SoldierClassId = BiosoldierClassId;

/**
 * Class record of the class data.
 */
export interface SoldierClassContent {
  /** Stable class number in share codes, from 1, unique across all soldier classes: a new class gets the maximum plus one; never changed or reused. */
  code: number
  /** Class name. */
  name: string
  /** Perk ids by rank. */
  perks: Record<SoldierRankId, readonly string[]>
}

export interface SoldierClass {
  id: SoldierClassId
  code: number
  name: string
  icon: SvgIcon
  perks: Record<SoldierRankId, readonly AbilityId[]>
  basePerk: AbilityId
}

/**
 * Soldier class of its record and icon; unknown ability ids are skipped. The base perk is the first perk of the first rank.
 *
 * @param id class id.
 * @param content class record.
 * @param icon class icon.
 */
export const createSoldierClass = (id: SoldierClassId, content: SoldierClassContent, icon: SvgIcon): SoldierClass => {
  const perks = typedEntries(content.perks).reduce((acc, [rankId, abilityIds]) => {
    acc[rankId] = abilityIds.filter(isAbilityId);

    return acc;
  }, {} as Record<SoldierRankId, AbilityId[]>);

  return {
    id,
    code: content.code,
    name: content.name,
    icon,
    perks,
    basePerk: perks[SOLDIER_RANKS[0].id][0],
  };
};
