import type { SoldierClassContent } from '../../model/classes';
import classesJson from '../data/classes.json';

/** Soldier class records by class id, from the game data. */
export const SOLDIER_CLASS_CONTENT = classesJson satisfies Record<string, SoldierClassContent>;
