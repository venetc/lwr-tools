import type { SvgIcon } from '@shared/ui/svg-icon';

import type classesJson from '../config/data/classes.json';
import type { AbilityId } from './abilities';
import type { SoldierRankId } from './ranks';

export type BiosoldierClassId = keyof typeof classesJson;

/**
 * Class record of `classes.json`.
 */
export interface BiosoldierClassContent {
  /** Stable class number in share codes, from 1: a new class gets the maximum plus one; never changed or reused. */
  code: number
  /** Class name. */
  name: string
  /** Ability ids by rank. */
  abilities: Record<SoldierRankId, readonly string[]>
}

export interface BiosoldierClass {
  id: BiosoldierClassId
  code: number
  name: string
  icon: SvgIcon
  abilities: Record<SoldierRankId, readonly AbilityId[]>
  baseBuild: readonly AbilityId[]
}
