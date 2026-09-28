import type { TalentBuild, TalentIcon, TalentRank } from '@shared/lib/talent-tree';
import type { SvgIcon } from '@shared/types';

import type abilitiesJson from '../config/data/abilities.json';
import type classesJson from '../config/data/classes.json';
import type ranksJson from '../config/data/ranks.json';

export type AbilityId = keyof typeof abilitiesJson;

export type SoldierRankId = keyof typeof ranksJson;

export type SoldierClassId = keyof typeof classesJson;

/**
 * Ability record of `abilities.json`.
 */
export interface AbilityContent {
  /** Stable ability number in share codes, from 1: a new ability gets the maximum plus one; never changed or reused. */
  code: number
  /** Ability name. */
  name: string
  /** Ability description. */
  description: string
  /** Ids of the abilities this ability grants. */
  grants?: string[]
}

/**
 * Class record of `classes.json`.
 */
export interface SoldierClassContent {
  /** Stable class number in share codes, from 1: a new class gets the maximum plus one; never changed or reused. */
  code: number
  /** Class name. */
  name: string
  /** Ability ids by rank. */
  abilities: Record<SoldierRankId, string[]>
}

/**
 * Rank record of `ranks.json`.
 */
export interface SoldierRankContent {
  /** Rank name. */
  name: string
}

export interface Ability {
  id: AbilityId
  code: number
  name: string
  description: string
  icon: TalentIcon
  grants: AbilityId[]
}

export interface SoldierRank {
  id: SoldierRankId
  name: string
  icon: SvgIcon
}

export interface SoldierClass {
  id: SoldierClassId
  code: number
  name: string
  icon: SvgIcon
  abilities: Record<SoldierRankId, AbilityId[]>
}

export type SoldierTalentRank = SoldierRank & TalentRank;

/**
 * Soldier build: class, selected talents and name, without editor state.
 */
export interface SoldierBuildData {
  /** Soldier class of the build. */
  soldierClass: SoldierClass
  /** Selected talents by rank, including the granted ones. */
  talents: TalentBuild
  /** Build name shown in the heading. */
  name: string
}
