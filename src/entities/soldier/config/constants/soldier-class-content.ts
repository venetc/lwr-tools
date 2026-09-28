import type { SoldierClassContent } from '../../model/types';
import classesJson from '../data/classes.json';

export const SOLDIER_CLASS_CONTENT = classesJson satisfies Record<string, SoldierClassContent>;
