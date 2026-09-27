import { COLUMNS } from '../config/constants';

/**
 * Grid column for a talent, keeping the rank talents centered.
 *
 * @param talentsInRank number of talents in the rank.
 * @param talentIndex talent index in the rank.
 * @returns one-based column number.
 */
export function talentColumn(talentsInRank: number, talentIndex: number): number {
  return COLUMNS[talentsInRank]?.[talentIndex] ?? talentIndex + 1;
}
