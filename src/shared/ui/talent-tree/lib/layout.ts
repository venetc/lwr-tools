import { COLUMNS } from '../config/constants';

/**
 * Колонка сетки для таланта, чтобы таланты ранга стояли по центру.
 *
 * @param talentsInRank сколько талантов на ранге.
 * @param talentIndex индекс таланта на ранге.
 * @returns номер колонки с единицы.
 */
export function talentColumn(talentsInRank: number, talentIndex: number): number {
  return COLUMNS[talentsInRank]?.[talentIndex] ?? talentIndex + 1;
}
