import type { SvgIcon } from '@shared/types';
import type { TalentRank } from '@shared/ui/talent-tree';
import type { ABILITY_ID } from './ability-id';
import type { SOLDIER_CLASS_ID } from './soldier-class-id';
import type { SOLDIER_RANK_ID } from './soldier-rank-id';

export type AbilityId = (typeof ABILITY_ID)[keyof typeof ABILITY_ID];

export interface Ability {
  id: AbilityId
  name: string
  description: string
  icon: string
  grants?: AbilityId[]
}

export type SoldierRankId = (typeof SOLDIER_RANK_ID)[keyof typeof SOLDIER_RANK_ID];

export interface SoldierRank {
  id: SoldierRankId
  name: string
  icon: SvgIcon
}

export type SoldierClassId = (typeof SOLDIER_CLASS_ID)[keyof typeof SOLDIER_CLASS_ID];

export interface SoldierClass {
  id: SoldierClassId
  name: string
  icon: SvgIcon
  abilities: Record<SoldierRankId, AbilityId[]>
}

export interface SoldierTalentRank extends TalentRank {
  soldierRank: SoldierRank
}
